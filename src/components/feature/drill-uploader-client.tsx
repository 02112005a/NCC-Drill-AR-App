'use client';

import { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import useProgressData, { CustomDrill } from '@/hooks/use-progress-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { List, Upload, FileText } from 'lucide-react';

export function DrillUploaderClient() {
  const [file, setFile] = useState<File | null>(null);
  const { customDrills, addCustomDrills } = useProgressData();
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      if (selectedFile && selectedFile.type === 'text/plain') {
        setFile(selectedFile);
      } else {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload a .txt file.',
          variant: 'destructive',
        });
        setFile(null);
        e.target.value = '';
      }
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast({
        title: 'No File Selected',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const newDrills = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(name => ({ name }));
      
      addCustomDrills(newDrills);
      toast({
        title: 'Upload Successful',
        description: `${newDrills.length} custom drills have been added.`,
      });
      setFile(null);
      // Reset the input field
      const input = document.getElementById('drill-file-input') as HTMLInputElement;
      if (input) input.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload />
            Upload New Drills
          </CardTitle>
          <CardDescription>
            Select a .txt file containing a list of your custom drill names.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input id="drill-file-input" type="file" accept=".txt" onChange={handleFileChange} />
          {file && <p className="text-sm text-muted-foreground">Selected file: {file.name}</p>}
          <Button onClick={handleUpload} disabled={!file} className="w-full">
            Upload Drills
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List />
            Your Custom Drills
          </CardTitle>
          <CardDescription>
            Here are the custom drills you have uploaded.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customDrills.length > 0 ? (
            <ul className="space-y-2">
              {customDrills.map((drill, index) => (
                <li key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{drill.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-center text-muted-foreground py-8">
              You haven&apos;t uploaded any custom drills yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
