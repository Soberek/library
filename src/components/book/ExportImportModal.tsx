import React, { useRef, useState } from 'react';
import { Download, Upload, CheckCircle2, FileSpreadsheet, FileCode, Loader2, AlertCircle } from 'lucide-react';
import type { Book } from '../../types/Book';
import {
  exportBooksToCsv,
  exportBooksToJson,
  parseBooksFromCsv,
  parseBooksFromJson,
} from '../../services/exportImportService';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface ExportImportModalProps {
  open: boolean;
  onClose: () => void;
  books: Book[];
  onImportBooks: (importedBooks: Omit<Book, 'id'>[]) => Promise<number>;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  open,
  onClose,
  books,
  onImportBooks,
}) => {
  const [tab, setTab] = useState<'export' | 'import'>('export');
  const [file, setFile] = useState<File | null>(null);
  const [parsedBooks, setParsedBooks] = useState<Omit<Book, 'id'>[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    if (importing) return;
    setFile(null);
    setParsedBooks([]);
    setError(null);
    setSuccessMsg(null);
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setSuccessMsg(null);

    try {
      const text = await selectedFile.text();
      let result: Omit<Book, 'id'>[] = [];

      if (selectedFile.name.endsWith('.json')) {
        result = parseBooksFromJson(text);
      } else if (selectedFile.name.endsWith('.csv')) {
        result = parseBooksFromCsv(text);
      } else {
        throw new Error('Obsługiwane są tylko pliki .json oraz .csv');
      }

      setParsedBooks(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd podczas odczytu pliku.');
      setParsedBooks([]);
    }
  };

  const handleExecuteImport = async () => {
    if (parsedBooks.length === 0) return;
    setImporting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const count = await onImportBooks(parsedBooks);
      setSuccessMsg(`Pomyślnie zaimportowano ${count} ${count === 1 ? 'książkę' : 'książek'} do Twojej biblioteki!`);
      setParsedBooks([]);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas importu.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title="Kopia zapasowa i Import"
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Tab switch */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 gap-1">
          <Button
            type="button"
            variant={tab === 'export' ? "outline" : "ghost"}
            size="sm"
            onClick={() => setTab('export')}
            leftIcon={<Download className="w-4 h-4" />}
            fullWidth
            className={cn(tab === 'export' && "text-indigo-600 shadow-2xs bg-white border-white")}
          >
            Eksportuj książki
          </Button>
          <Button
            type="button"
            variant={tab === 'import' ? "outline" : "ghost"}
            size="sm"
            onClick={() => setTab('import')}
            leftIcon={<Upload className="w-4 h-4" />}
            fullWidth
            className={cn(tab === 'import' && "text-indigo-600 shadow-2xs bg-white border-white")}
          >
            Importuj z pliku
          </Button>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {tab === 'export' ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Pobierz kopię zapasową całej swojej biblioteki ({books.length}{' '}
              {books.length === 1 ? 'książka' : 'książek'}). Wybierz format odpowiadający Twoim potrzebom:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* JSON card */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1">
                  <FileCode className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 font-display">Format JSON</h4>
                <p className="text-xs text-slate-500 flex-1">
                  Kompletna struktura danych ze wszystkimi polami. Idealna do kopii zapasowej.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={books.length === 0}
                  onClick={() => exportBooksToJson(books)}
                  className="w-full mt-2 gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Pobierz .JSON</span>
                </Button>
              </div>

              {/* CSV card */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 font-display">Format CSV (Excel)</h4>
                <p className="text-xs text-slate-500 flex-1">
                  Tabela z polskimi znakami (UTF-8 BOM). Otwórz w Microsoft Excel lub Google Sheets.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={books.length === 0}
                  onClick={() => exportBooksToCsv(books)}
                  className="w-full mt-2 gap-1.5 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Pobierz .CSV</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Wgraj plik <code className="font-mono text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">.json</code> lub <code className="font-mono text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">.csv</code> z listą książek, aby dodać je hurtowo do swojej kolekcji.
            </p>

            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all flex flex-col items-center gap-2",
                file
                  ? "border-indigo-500 bg-indigo-50/50"
                  : "border-slate-300 bg-slate-50 hover:border-indigo-400"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <Upload className="w-8 h-8 text-slate-400" />
              <p className="text-xs font-bold text-slate-700">
                {file ? file.name : "Kliknij tutaj, aby wybrać plik .JSON lub .CSV"}
              </p>
              <span className="text-[11px] text-slate-400">Maksymalny rozmiar: 5 MB</span>
            </div>

            {parsedBooks.length > 0 && (
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="text-xs font-bold text-indigo-600">
                  Rozpoznano {parsedBooks.length} {parsedBooks.length === 1 ? 'książkę' : 'książek'} do zaimportowania:
                </span>
                <div className="max-h-36 overflow-y-auto space-y-1 pr-1 text-xs">
                  {parsedBooks.slice(0, 10).map((b, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-b border-slate-100">
                      <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                        • {b.title} — {b.author}
                      </span>
                      <span className="text-slate-400 text-[11px] shrink-0">
                        {b.genre} · {b.overallPages} str.
                      </span>
                    </div>
                  ))}
                  {parsedBooks.length > 10 && (
                    <p className="text-[11px] text-slate-400 pt-1">
                      ... i {parsedBooks.length - 10} więcej
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={handleClose} disabled={importing}>
            Zamknij
          </Button>
          {tab === 'import' && parsedBooks.length > 0 && (
            <Button
              onClick={handleExecuteImport}
              loading={importing}
              loadingText="Importowanie…"
              leftIcon={<Upload className="w-4 h-4" />}
            >
              Zaimportuj {parsedBooks.length} książek
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ExportImportModal;
