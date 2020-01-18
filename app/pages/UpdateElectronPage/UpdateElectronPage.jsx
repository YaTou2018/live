import React, { useEffect, useState } from 'react';
import { windowClose, getDeviceType } from '@utils/ysUtils';
import FetchService from '@global/services/FetchService';
import { getUrlParams } from '@utils/url';
import { YsGlobal } from '@global/handleGlobal';
import './UpdateElectronPage.scss';
const { pagesText, serviceText } = YsGlobal.languageInfo;
const UpdateElectronPage = () => {
  const [updateClient, setUpdateClient] = useState('');
  const electronversion = getUrlParams('electronversion');
  const [downloadProcess, setDownloadProcess] = useState(0);
  const [updateStep, setUpdateStep] = useState('loading_inner');

  useEffect(() => {
    const type = getDeviceType() === 'WindowPC' ? 1 : 0;
    FetchService.getupdateinfo(electronversion, type).then(res => {
      if (res.version && res.version !== electronversion) {
        setUpdateClient(res);
      }
    });
  }, [electronversion]);

  const downloadPkg = () => {
    setUpdateStep('downPkg');
    let size = 0;
    fetch(`https://${updateClient.setupaddr}`)
      .then(response => {
        const reader = response.body.getReader();
        const stream = new ReadableStream({
          start(controller) {
            function push() {
              // "done"是一个布尔型，"value"是一个Unit8Array
              reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                size += 1;
                if (size > 999) {
                  size = 999;
                }
                setDownloadProcess(Math.floor(size / 10));
                controller.enqueue(value);
                push();
              });
            }
            push();
          },
        });
        return new Response(stream);
      })
      .then(res => {
        res.blob().then(blob => {
          const a = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          a.href = url;
          a.download = updateClient.filename;
          a.click();
          window.URL.revokeObjectURL(url);
          setDownloadProcess(100);
          setUpdateStep('updateComplete');
        });
      });
  };

  const laterUpdate = () => {
    setUpdateClient('later');
  };

  const exitUpdate = () => {
    windowClose();
    document.documentElement.style.pointerEvents = 'none';
  };
  const updateElectronClient = () => {
    return (
      <div className="connect-loading updateClient">
        {updateStep === 'loading_inner' && (
          <div className="loading_inner">
            <div className="title">{pagesText.livePageInner.foundNewVersion}</div>
            <div className="content">{pagesText.livePageInner.newVersionTips}</div>
            <div className="footer">
              {updateClient.updateflag !== '1' && (
                <button className="class-btn" onClick={laterUpdate}>
                  {pagesText.livePageInner.laterUpdate}
                </button>
              )}
              <button className="class-btn" onClick={downloadPkg}>
                {pagesText.livePageInner.updateClient}
              </button>
            </div>
          </div>
        )}
        {updateStep === 'downPkg' && (
          <div className="downPkg">
            <div className="downPkgProcess">
              <div style={{ width: `${downloadProcess}%` }}></div>
            </div>
            <div>
              {pagesText.livePageInner.downloadPkg}&nbsp;{downloadProcess}%
            </div>
          </div>
        )}
        {updateStep === 'updateComplete' && (
          <div className="loading_inner">
            <div className="title">{pagesText.livePageInner.updateComplete}</div>
            <button className="class-btn" onClick={exitUpdate}>
              {serviceText.roomListner.okBtn}
            </button>
          </div>
        )}
      </div>
    );
  };

  if (electronversion && updateClient && updateClient !== 'later') {
    return updateElectronClient();
  }
  return '';
};

export default UpdateElectronPage;
