from pathlib import Path
import hashlib, json
from pypdf import PdfReader, PdfWriter

root=Path(__file__).resolve().parent.parent
manifest=json.loads((root/'docs/adhd-deluxe-release-assets.json').read_text(encoding='utf-8'))
private=root/'.artifacts/adhd-deluxe/private'
downloaded=root/'.artifacts/adhd-deluxe/downloaded'
checks=[]
for index, entry in enumerate(manifest['files']):
    source=private/entry['file']
    copy=downloaded/entry['file']
    assert hashlib.sha256(source.read_bytes()).hexdigest()==entry['sha256']
    assert copy.read_bytes()==source.read_bytes()
    reader=PdfReader(copy)
    count=[120,10,10][index]
    assert len(reader.pages)==count
    fields=reader.get_fields() or {}
    assert len(fields)==[0,50,0][index]
    assert all(not field.get('/V') for field in fields.values())
    if index==1:
        widgets={str(annot.get_object().get('/T')):annot.get_object() for page in reader.pages for annot in page.get('/Annots',[]) if annot.get_object().get('/Subtype')=='/Widget'}
        assert set(widgets)==set(fields)
        assert all(int(field.get('/Ff',0)) & 4096 for field in fields.values())
        writer=PdfWriter();writer.clone_document_from_reader(reader)
        values={key:'En liten handling idag.\nSvenska tecken: å, ä och ö.' for key in fields}
        writer.update_page_form_field_values(None,values,auto_regenerate=False)
        target=root/'.artifacts/adhd-deluxe/filled-worksheet-check.pdf'
        writer.write(target)
        reopened=PdfReader(target)
        assert all(reopened.get_fields()[key].get('/V')==value for key,value in values.items())
        roundtrip_widgets={str(annot.get_object().get('/T')):annot.get_object() for page in reopened.pages for annot in page.get('/Annots',[]) if annot.get_object().get('/Subtype')=='/Widget'}
        assert all(roundtrip_widgets[key].get('/V')==value for key,value in values.items())
        assert all(widget['/AP']['/N'].get_object().get_data() for widget in roundtrip_widgets.values())
    checks.append({'file':entry['file'],'hash':entry['sha256'],'pages':count,'fields':len(fields),'download_matches_source':True})
result={'files':checks,'all_50_fields_saved_reopened':True,'source_files_unchanged':True}
(root/'.artifacts/adhd-deluxe/pdf-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False,indent=2))
