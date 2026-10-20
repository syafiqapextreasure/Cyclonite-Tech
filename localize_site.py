"""Build complete static Malay counterparts with reciprocal language links."""
from pathlib import Path
from html.parser import HTMLParser
from html import escape
from urllib.parse import urlsplit, urlunsplit, parse_qs, urlencode
import json, re
ROOT=Path(__file__).resolve().parent
TRANSLATIONS=dict(line.split('|||',1) for line in (ROOT/'ms-translations.txt').read_text(encoding='utf-8').splitlines() if '|||' in line)

def translate(value):
    plain=value.strip()
    if re.fullmatch(r'\d+ photographs?',plain):return plain.split()[0]+' foto'
    if plain in TRANSLATIONS:
        return value[:len(value)-len(value.lstrip())]+TRANSLATIONS[plain]+value[len(value.rstrip()):]
    if plain.startswith('Open ') and plain.endswith(' photograph'):
        return 'Buka foto '+translate(plain[5:-11])
    return value

def build_languages(origin, paths):
    out=ROOT/'dist'; known=set(paths)|{'/404.html'}
    def local_url(url):
        u=urlsplit(url)
        if u.netloc and u.netloc!=urlsplit(origin).netloc: return url
        if u.path not in known: return url
        if u.fragment in ('business','website'): return url
        return urlunsplit((u.scheme,u.netloc,'/ms'+u.path,u.query,u.fragment))
    def schema_value(value,key=''):
        if isinstance(value,dict): return {k:schema_value(v,k) for k,v in value.items()}
        if isinstance(value,list): return [schema_value(v,key) for v in value]
        if not isinstance(value,str): return value
        if key=='inLanguage':return 'ms-MY'
        if key in ('url','@id','item'):return local_url(value)
        return translate(value)
    class MalayHTML(HTMLParser):
        def __init__(self): super().__init__(convert_charrefs=True); self.parts=[];self.json_script=False
        def handle_decl(self,data):self.parts.append('<!'+data+'>')
        def handle_starttag(self,tag,attrs):
            a=dict(attrs)
            if tag=='script':self.json_script=a.get('type')=='application/ld+json'
            if tag=='html':a['lang']='ms-MY'
            for k in ('alt','aria-label','placeholder','data-title','data-caption','title'):
                if k in a:a[k]=translate(a[k])
            if tag=='meta':
                if a.get('name')=='description' or a.get('property') in ('og:title','og:description'):a['content']=translate(a['content'])
                if a.get('property')=='og:locale':a['content']='ms_MY'
                if a.get('property')=='og:url':a['content']=local_url(a['content'])
            if 'href' in a:
                if a['href'].startswith('https://wa.me/'):
                    u=urlsplit(a['href']); text=parse_qs(u.query).get('text',[''])[0]
                    text=text.replace('Hello Cyclonite Tech, I would like to enquire about ','Salam Cyclonite Tech, saya ingin bertanya tentang ').replace('your services','perkhidmatan anda').replace('. Please contact me to discuss my project.','. Boleh hubungi saya untuk bincang projek ini?')
                    for en in ('Diving & Inspection','Salvage & Underwater Works','UXO & EOD Support','Equipment & Marine Electronics','Consultancy & Training','Building & Structural Services'):text=text.replace(en,translate(en))
                    a['href']=urlunsplit((u.scheme,u.netloc,u.path,urlencode({'text':text}),u.fragment))
                else:a['href']=local_url(a['href'])
            self.parts.append('<'+tag+''.join(' '+k+(('="'+escape(v,quote=True)+'"') if v is not None else '') for k,v in a.items())+'>')
        def handle_endtag(self,tag):
            self.parts.append('</'+tag+'>')
            if tag=='script':self.json_script=False
        def handle_data(self,data):
            if self.json_script:self.parts.append(json.dumps(schema_value(json.loads(data)),ensure_ascii=False).replace('</',r'<\/'))
            else:self.parts.append(escape(translate(data),quote=False))
        def handle_comment(self,data):self.parts.append('<!--'+data+'-->')
    for path in [*paths,'/404.html']:
        file=out/('index.html' if path=='/' else path.lstrip('/')+'index.html' if path.endswith('/') else path.lstrip('/'))
        english=file.read_text(encoding='utf-8')
        parser=MalayHTML();parser.feed(english);malay=''.join(parser.parts)
        alternates=''.join(f'<link rel="alternate" hreflang="{lang}" href="{origin}{url}">' for lang,url in [('en-MY',path),('ms-MY','/ms'+path),('x-default',path)])
        for lang,html,target in [('en',english,file),('ms',malay,out/('ms/index.html' if path=='/' else 'ms/'+path.lstrip('/')+'index.html' if path.endswith('/') else 'ms/'+path.lstrip('/')))]:
            switch='<div class="language-switch" role="group" aria-label="'+('Language' if lang=='en' else 'Bahasa')+'">'+''.join(f'<a href="{url}" lang="{code}" hreflang="{code}-MY" title="{label}"'+(' aria-current="true"' if code==lang else '')+f'>{short}</a>' for code,url,label,short in [('en',path,'English','EN'),('ms','/ms'+path,'Bahasa Melayu','BM')])+'</div>'
            html=html.replace('<button class="menu-toggle"',switch+'<button class="menu-toggle"',1).replace('</head>',alternates+'</head>')
            target.parent.mkdir(parents=True,exist_ok=True);target.write_text(html,encoding='utf-8')
    sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
    for path in paths:
        alternates=''.join(f'<xhtml:link rel="alternate" hreflang="{lang}" href="{origin}{url}"/>' for lang,url in [('en-MY',path),('ms-MY','/ms'+path),('x-default',path)])
        for url in (path,'/ms'+path):sitemap+=f'<url><loc>{origin}{url}</loc>{alternates}</url>\n'
    (out/'sitemap.xml').write_text(sitemap+'</urlset>\n',encoding='utf-8')
    print(f'Built {len(paths)*2} indexable pages in English and Bahasa Melayu.')
