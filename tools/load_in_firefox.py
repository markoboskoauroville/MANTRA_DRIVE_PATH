#!/usr/bin/env python3
"""Load extension/ into Marko's running Firefox as a temporary add-on (WebDriver BiDi webExtension.install on :9222),
replacing the copy loaded before. Firefox keeps a content script it has read cached in the tab's process, so after an
edit this is how the tab gets the new file. A temporary add-on goes when Firefox quits.
    python3 tools/load_in_firefox.py
"""
import importlib.machinery, importlib.util, os, sys
here = os.path.dirname(os.path.abspath(__file__))
loader = importlib.machinery.SourceFileLoader('firefoxctl', os.path.expanduser('~/.local/bin/firefoxctl'))
spec = importlib.util.spec_from_loader('firefoxctl', loader)
fc = importlib.util.module_from_spec(spec); loader.exec_module(fc)
b = fc.Bidi()
try:
    r = b.call('webExtension.install', {'extensionData': {'type': 'path', 'path': os.path.join(os.path.dirname(here), 'extension')}})
    print('loaded:', r.get('extension'))
finally:
    b.close()
