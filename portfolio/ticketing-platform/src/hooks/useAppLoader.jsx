import { useState, useEffect } from 'react';

export const useAppLoader = (assetsToLoad = []) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0); // เริ่มต้นที่ 0
  const [currentTask, setCurrentTask] = useState("กำลังเตรียมความพร้อม...");
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const startLoading = async () => {
      // 🌟 1. ดันหลอดให้ขยับก่อนเลย (หลอกสายตาให้ดูเหมือนกำลังทำงาน)
      setProgress(10);
      setCurrentTask("กำลังตรวจสอบข้อมูลระบบ...");
      await new Promise(r => setTimeout(r, 400));
      
      if (!isMounted) return;
      setProgress(25); // ขยับไป 25%

      // 🌟 2. ถ้าไม่มีรูปภาพให้โหลดเลย ให้กระโดดไปตอนจบ
      if (!assetsToLoad || assetsToLoad.length === 0) {
        finishLoading();
        return;
      }

      let loadedCount = 0;
      const totalAssets = assetsToLoad.length;

      // 🌟 3. ระบบกันค้าง (Timeout): ถ้ารูปโหลดนานเกิน 8 วินาที ให้บังคับผ่านเลย
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 8000));

      const imagePromises = assetsToLoad.map((url) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = url;
          
          img.onload = () => {
            loadedCount++;
            if (isMounted) {
              // คำนวณเปอร์เซ็นต์ที่เหลือ (จาก 25% ถึง 95%)
              const percent = 25 + Math.floor((loadedCount / totalAssets) * 70);
              setProgress(percent);
              setCurrentTask(`กำลังดาวน์โหลดรูปภาพ... (${loadedCount}/${totalAssets})`);
            }
            resolve();
          };
          
          img.onerror = () => {
            // 🌟 ถ้ารูปพังหรือ URL ผิด ให้นับว่าผ่านเลย หลอดจะได้เดินต่อ
            loadedCount++;
            resolve(); 
          };
        });
      });

      // 🌟 4. ให้ระบบโหลดรูปลงแข่งกับระบบจับเวลา (ถ้าอันไหนเสร็จก่อน ให้ไปต่อทันที)
      await Promise.race([Promise.all(imagePromises), timeoutPromise]);

      if (isMounted) finishLoading();
    };

    const finishLoading = async () => {
      setProgress(100); // ดันให้เต็ม 100%
      setCurrentTask("เสร็จสมบูรณ์! กำลังเข้าสู่ระบบ...");
      await new Promise(r => setTimeout(r, 400));
      
      if (isMounted) setIsFinishing(true);
      
      setTimeout(() => {
        if (isMounted) setIsLoading(false);
      }, 600);
    };

    startLoading();

    return () => { isMounted = false; };
  }, [assetsToLoad]);

  return { isLoading, progress, currentTask, isFinishing };
};