import React, { useState } from 'react';
import { Upload, FileText, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { uploadResumes, bulkSaveStudents } from '@/services/api';

const ResumeUpload = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [parsedData, setParsedData] = useState([]);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
        setMessage(null);
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploading(true);
        setMessage(null);
        setParsedData([]);

        const formData = new FormData();
        files.forEach(file => {
            formData.append('resumes', file);
        });

        try {
            const response = await uploadResumes(formData);
            const results = response.results;

            const successfulParses = results
                .filter(r => r.status === 'success')
                .map(r => ({ ...r.data, originalFilename: r.filename }));

            setParsedData(successfulParses);

            const failedCount = results.filter(r => r.status === 'failed').length;
            if (failedCount > 0) {
                setMessage({ type: 'warning', text: `Parsed ${successfulParses.length} resumes. ${failedCount} failed.` });
            } else {
                setMessage({ type: 'success', text: `Successfully parsed all ${successfulParses.length} resumes.` });
            }

        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Failed to upload and parse resumes.' });
        } finally {
            setUploading(false);
        }
    };

    const handleSaveToDb = async () => {
        if (parsedData.length === 0) return;

        setSaving(true);
        try {
            const response = await bulkSaveStudents(parsedData);
            if (response.success) {
                setMessage({ type: 'success', text: `Successfully saved ${response.inserted} students to database!` });
                setParsedData([]);
                setFiles([]);
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Failed to save data to database.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <Upload className="h-6 w-6" />
                        Bulk Resume Upload
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end gap-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <label htmlFor="resume-upload" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Select Resumes (PDF/DOCX)
                            </label>
                            <input
                                id="resume-upload"
                                type="file"
                                multiple
                                accept=".pdf,.docx,.doc"
                                onChange={handleFileChange}
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <Button onClick={handleUpload} disabled={files.length === 0 || uploading}>
                            {uploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Parsing with Gemini...
                                </>
                            ) : (
                                'Upload & Parse'
                            )}
                        </Button>
                    </div>

                    {message && (
                        <div className={`mt-4 p-3 rounded-md flex items-center gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-900' :
                            message.type === 'warning' ? 'bg-yellow-50 text-yellow-900' :
                                'bg-green-50 text-green-900'
                            }`}>
                            {message.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                            {message.text}
                        </div>
                    )}
                </CardContent>
            </Card>

            {parsedData.length > 0 && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Parsed Data Preview</CardTitle>
                        <Button onClick={handleSaveToDb} disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Confirm & Save to Database'
                            )}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Education</TableHead>
                                    <TableHead>Skills</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {parsedData.map((student, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell>{student.email}</TableCell>
                                        <TableCell>{student.phone}</TableCell>
                                        <TableCell>
                                            {student.education?.degree} - {student.education?.university}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {student.skills?.slice(0, 3).map((skill, i) => (
                                                    <span key={i} className="inline-flex items-center rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 text-slate-950">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {student.skills?.length > 3 && (
                                                    <span className="text-xs text-slate-500">+{student.skills.length - 3} more</span>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ResumeUpload;
