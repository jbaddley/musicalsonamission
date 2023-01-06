import React, { useCallback, useEffect, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { Button, Container, Modal } from "semantic-ui-react";
import styles from "./ImageEditor.module.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface ImageEditorProps {
  src?: string;
  editedSrc?: string;
  onSave: (blob: Blob, name: string, designState: any) => void;
  designState?: any;
  open?: boolean;
}
export function ImageEditor({ src, editedSrc, onSave, designState, open }: ImageEditorProps) {
  const [show, setShow] = useState(open);
  const [position, setPosition] = useState(designState?.position || { x: 0, y: 0 });
  const [scale, setScale] = useState(designState?.scale || 1);
  const avatarRef = useRef<AvatarEditor>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setShow(open);
  }, [open]);

  useEffect(() => {
    if (designState?.scale) {
      setPosition(designState.scale);
    }
  }, [designState?.scale]);

  useEffect(() => {
    if (designState?.position) {
      setPosition(designState.position);
    }
  }, [designState?.position]);

  const openImgEditor = () => {
    setShow(true);
  };

  const closeImgEditor = () => {
    setShow(false);
  };

  const updatePreview = useCallback(
    (e: any) => {
      if (e) {
        setPosition(e);
      }
      if (avatarRef.current && canvasRef.current) {
        const img = avatarRef.current.getImage();

        var ctx = canvasRef.current.getContext("2d");
        if (!ctx) {
          return;
        }

        var canvas = ctx.canvas;
        var hRatio = canvas.width / img.width;
        var vRatio = canvas.height / img.height;
        var ratio = Math.min(hRatio, vRatio);
        var centerShift_x = (canvas.width - img.width * ratio) / 2;
        var centerShift_y = (canvas.height - img.height * ratio) / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();

        ctx.beginPath();
        ctx.arc(125, 125, 125, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          centerShift_x,
          centerShift_y,
          img.width * ratio,
          img.height * ratio
        );
      }
    },
    [avatarRef.current, canvasRef.current, scale]
  );

  useEffect(() => {
    updatePreview(position);
  }, [scale]);

  const handleSave = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          onSave(blob, "edited", { position, scale });
          closeImgEditor();
        }
      });
    }
  }, [avatarRef.current, canvasRef.current, position, scale]);

  const handleZoom = (e: any) => {
    setScale(e / 100);
  };

  return (
    <div>
      {editedSrc && <img style={{ maxWidth: 250, maxHeight: 250 }} alt='' src={editedSrc} onClick={openImgEditor} />}
      <Modal open={show} onClose={() => setShow(false)}>
        <Modal.Header>Edit Image</Modal.Header>
        <Modal.Content className={styles.content}>
          <div className={styles.editor}>
            <AvatarEditor
              image={src || ""}
              width={250}
              position={position}
              height={250}
              border={50}
              color={[255, 255, 255, 0.6]} // RGBA
              scale={scale}
              rotate={0}
              borderRadius={125}
              crossOrigin={"anonymous"}
              onPositionChange={updatePreview}
              onImageReady={updatePreview}
              ref={avatarRef}
            />
            <div className={styles.slider}>
              <Slider value={scale * 100} min={20} max={200} onChange={handleZoom} className={styles.slider} />
            </div>
          </div>
          <div className={styles.preview}>
            <canvas ref={canvasRef} height={250} width={250} />
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button secondary onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button primary onClick={handleSave}>
            Done
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}
