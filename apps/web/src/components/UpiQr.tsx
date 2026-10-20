"use client";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
export default function UpiQr({ uri }: { uri: string }) {
  const [src, setSrc] = useState(""); useEffect(() => { QRCode.toDataURL(uri, { margin: 1, width: 240 }).then(setSrc).catch(() => setSrc("")); }, [uri]);
  return src ? <div><img src={src} alt="UPI QR" width={240} height={240} style={{ background: "#fff", borderRadius: 8 }} /><div className="muted" style={{ wordBreak: "break-all" }}>{uri}</div></div> : null;
}
