import React, { FC, useRef, useState } from "react";
import { FileUpload } from "primereact/fileupload";

import { Toast } from "primereact/toast";
import { Card } from "reactstrap";

interface FileUploadProps {
  chooseLabel: any;
  className: string;
}

const FileUploadComponent: FC<FileUploadProps> = ({ chooseLabel }) => {
  const [file, setFile] = useState<any>();
  const toast = useRef<any>(null);
  const [previewUrl, setPreviewUrl] = useState<any>(null);

  const onUpload = () => {
    toast?.current?.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  const onSelect = (event: any) => {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: any) => {
    setFile(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="file-upload-btn">
      <Toast ref={toast} />
      <Card className="upload-image d-flex justify-content-center align-items-center">
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" />
        ) : (
          <p className="text-muted"></p>
        )}
      </Card>

      <FileUpload
        mode="basic"
        name="demo[]"
        url="/api/upload"
        accept="image/*"
        maxFileSize={1000000}
        onUpload={onUpload}
        onSelect={onSelect}
        auto
        className=""
        chooseLabel={chooseLabel}
      />
    </div>
  );
};

export default FileUploadComponent;
