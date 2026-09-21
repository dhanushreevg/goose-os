import type { CSSProperties, ReactElement, ReactNode } from 'react';
import type { GoogleAppId } from '../appIcon';
import { isGoogleApp } from '../appIcon';

interface FaceProps {
  w: number;
  h: number;
  clipId?: string;
  clipD?: string;
  children: ReactNode;
}

/**
 * Renders a stack of absolutely-positioned HTML layers inside an SVG viewBox
 * via <foreignObject>, preserving the exact CSS gradients from the design
 * (including conic gradients) while scaling the icon to any size.
 */
function Face({ w, h, clipId, clipD, children }: FaceProps) {
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block' }}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      {clipD && (
        <defs>
          <clipPath id={clipId}>
            <path d={clipD} />
          </clipPath>
        </defs>
      )}
      <foreignObject width={w} height={h} clipPath={clipId ? `url(#${clipId})` : undefined}>
        <div style={{ position: 'relative', width: w, height: h }}>{children}</div>
      </foreignObject>
    </svg>
  );
}

function Layer({ style }: { style: CSSProperties }) {
  return <div style={{ position: 'absolute', ...style }} />;
}

const MAPS_PIN =
  'M127 33 C67 33 15 86 15 145 C15 204 64 282 121 314 L127 324 L133 314 C190 282 239 204 239 145 C239 86 187 33 127 33 Z';

const KEEP_BG =
  'radial-gradient(64.41% 64.1% at 50% 73.08%, rgba(255, 237, 68, 0) 46.05%, #FFBB04 100%), linear-gradient(90deg, #FFED44 0%, rgba(255, 237, 68, 0) 29.56%), linear-gradient(270deg, #FFED44 0%, rgba(255, 237, 68, 0) 30.43%), radial-gradient(53.93% 70.09% at 50% 100%, #FDBAD9 44.9%, rgba(255, 230, 112, 0) 100%), radial-gradient(62.4% 84.19% at 50% 105.98%, #FEED54 0%, #FDDD28 50%, #FFBD07 100%)';

const FORMS_SPLAT =
  'linear-gradient(90deg, #61AFFF 0%, #7372FD 35.92%, #7270FA 100%)';

const SITES_HEADER =
  'radial-gradient(54.73% 201.82% at 0% 100%, #AAA5FF 0%, rgba(170, 165, 255, 0) 100%), linear-gradient(90deg, #3185FF 0%, #3185FF 100%)';

const MAPS_BG =
  'conic-gradient(from 180deg at 50% 44.32%, #21C161 0deg, #ECCF17 56.13deg, #F94548 116.94deg, #9F71DB 154.81deg, #3785FD 192.43deg, #12A0CE 247.32deg, #0DBB62 298.73deg, #21C161 360deg)';

const MEET_CAM =
  'radial-gradient(93.04% 106.15% at 100% 50%, #FDBAD9 14.16%, rgba(255, 230, 108, 0) 100%), linear-gradient(220.63deg, #FDDE16 0%, #FFDB13 40%, #FEC602 100%)';

const CHAT_BODY =
  'linear-gradient(270deg, #0FBD5C 0%, rgba(15, 189, 92, 0) 11.97%), linear-gradient(90deg, #0FBD5C 0%, rgba(15, 189, 92, 0) 11.97%), linear-gradient(180deg, #7FCCFE 0%, #12B95F 32%, #0EBB61 60%, #0EBB61 100%)';

const GMAIL_TOP =
  'linear-gradient(88.09deg, rgba(255, 9, 0, 0) 41.48%, #FFDC09 95.2%), linear-gradient(101.22deg, #FD64A0 10.17%, #FC4243 39.36%, #FF3F3A 66.16%)';

const CAL_TOP =
  'linear-gradient(270deg, #4091FE -2.32%, rgba(64, 145, 254, 0) 18%), linear-gradient(90deg, #4091FE -2.32%, rgba(64, 145, 254, 0) 18%), linear-gradient(180deg, #A5A7FE 0%, #3F92FF 50.48%, #3B90FB 100%)';

const TASKS_BG =
  'linear-gradient(268.67deg, #3588FF 1.07%, rgba(53, 136, 255, 0) 20.05%), linear-gradient(90deg, #3588FF 0%, rgba(53, 136, 255, 0) 19.42%), linear-gradient(180deg, #3584FB 0%, #3185FF 47.1%, #A2A6FF 100%)';

const DOCS_BG =
  'linear-gradient(90deg, #3588FF 0%, rgba(49, 133, 255, 0) 19.42%), linear-gradient(207.99deg, #2C83FC 20%, #3185FF 40%, #A7A7FF 79.94%)';

const SHEETS_BG =
  'linear-gradient(0deg, #14BA61 0%, rgba(20, 186, 97, 0) 23.04%), linear-gradient(180deg, #14BA61 0%, rgba(20, 186, 97, 0) 23.04%), linear-gradient(90deg, #7BC8FE 0%, #11BC5C 67.68%, #0EBB5E 100%)';

const SLIDES_BG =
  'linear-gradient(270deg, #FFC300 0%, rgba(255, 195, 0, 0) 16.09%), linear-gradient(90deg, #FFC300 0%, rgba(255, 195, 0, 0) 16.09%), linear-gradient(180deg, #FFBE00 0%, #FEC70B 48.85%, #FFEF46 100%)';

const ICONS: Record<GoogleAppId, ReactElement> = {
  'google-keep': (
    <Face w={248} h={316}>
      <Layer
        style={{ width: 112, height: 82, left: 68, top: 234, background: 'linear-gradient(180deg, #F59F0A 0%, #FB9C02 100%)' }}
      />
      <Layer style={{ width: 248, height: 234, left: 0, top: 0, background: KEEP_BG }} />
      <Layer style={{ width: 63, height: 46, left: 92, top: 188, background: '#FFFFFF', borderRadius: 23 }} />
    </Face>
  ),
  'google-voice': (
    <Face w={308} h={308}>
      <Layer
        style={{
          width: 178,
          height: 178,
          right: 0.24,
          top: 0,
          background: 'radial-gradient(74.72% 74.72% at 0% 100%, #7DC8FF 15.06%, #60D678 76.24%, #5BC969 100%)',
        }}
      />
      <Layer
        style={{
          width: 248,
          height: 248,
          left: -0.24,
          bottom: 0,
          background: 'linear-gradient(225deg, #76C6EC 41.92%, #30BA99 53.7%, #03AE55 65.03%)',
        }}
      />
    </Face>
  ),
  'google-forms': (
    <Face w={268} h={264}>
      <Layer style={{ width: 88, height: 87.91, left: 0, top: 0, background: '#7672F4' }} />
      <Layer style={{ width: 180, height: 87.91, left: 88, top: 0.13, background: FORMS_SPLAT, borderRadius: 44 }} />
      <Layer style={{ width: 180, height: 87.91, left: 88, top: 87.91, background: '#5746E4', borderRadius: 44 }} />
      <Layer style={{ width: 180, height: 87.91, left: 88, top: 175.82, background: '#979DFF', borderRadius: 44 }} />
      <Layer style={{ width: 88, height: 87.91, left: 0, top: 87.91, background: '#5746E4' }} />
      <Layer style={{ width: 88, height: 87.91, left: 0, top: 176.09, background: '#BAC0FE' }} />
      <Layer style={{ width: 212, height: 41.96, left: 23, top: 22.98, background: '#FFFFFF' }} />
    </Face>
  ),
  'google-sites': (
    <Face w={296} h={246}>
      <Layer
        style={{ width: 296, height: 246, left: 0, top: 0, background: 'linear-gradient(125.49deg, #54A0FA 31.61%, #4FA1FE 101.35%)', borderRadius: 46 }}
      />
      <Layer style={{ width: 88, height: 170, left: 0, top: 76, background: 'linear-gradient(180deg, #9FD0FF 0%, #9DD2FF 100%)' }} />
      <Layer style={{ width: 296, height: 76, left: 0, top: 0, background: SITES_HEADER }} />
      <Layer style={{ width: 54, height: 46, left: 212, top: 168, background: '#FFFFFF', borderRadius: 23 }} />
    </Face>
  ),
  'google-maps': (
    <Face w={254} h={324} clipId="google-maps-pin" clipD={MAPS_PIN}>
      <Layer style={{ width: 254, height: 324, left: 0, top: 0, background: MAPS_BG }} />
    </Face>
  ),
  'google-meet': (
    <Face w={310} h={244}>
      <Layer style={{ width: 226, height: 244, left: 0, top: 0, background: MEET_CAM }} />
      <Layer
        style={{ width: 84, height: 179.88, left: 226, top: 37.06, background: 'linear-gradient(215.99deg, #FCAF00 0.3%, #FEA100 69.68%)' }}
      />
      <Layer style={{ width: 50, height: 50, left: 30, bottom: 30, background: '#FFFFFF' }} />
    </Face>
  ),
  'google-chat': (
    <Face w={308} h={264}>
      <Layer style={{ width: 308, height: 227.86, left: 0, top: 36.14, background: CHAT_BODY }} />
      <Layer style={{ width: 279.08, height: 77.36, left: 14.46, top: 0, background: 'linear-gradient(180deg, #08AC56 0%, #09AB5E 100%)' }} />
      <Layer style={{ width: 142, height: 54.21, left: 84, top: 107.41, background: '#FFFFFF' }} />
    </Face>
  ),
  gmail: (
    <Face w={312} h={246}>
      <Layer style={{ width: 68, height: 214, left: 0, top: 32, background: 'linear-gradient(180deg, #F02F3B 25.28%, #FD413F 50%, #F9403D 100%)' }} />
      <Layer style={{ width: 68, height: 214, left: 244, top: 32, background: 'linear-gradient(180deg, #42C96D 16.82%, #08B387 58%, #3989F8 100%)' }} />
      <Layer style={{ width: 312, height: 174, left: 0, top: 0, background: GMAIL_TOP }} />
    </Face>
  ),
  'google-calendar': (
    <Face w={268} h={288}>
      <Layer style={{ width: 268, height: 134, left: 0, top: 154, background: 'linear-gradient(180deg, #4598FF 0%, #3386FC 100%)' }} />
      <Layer style={{ width: 268, height: 134, left: 0, top: 20, background: CAL_TOP }} />
      <Layer style={{ width: 214.62, height: 24.97, left: 25.22, top: 0, background: 'linear-gradient(180deg, #BAE2FB 0%, #BFDAF5 100%)' }} />
      <Layer style={{ width: 148.22, height: 134, left: 54.49, top: 86, background: '#FFFFFF' }} />
    </Face>
  ),
  'google-tasks': (
    <Face w={304} h={296}>
      <Layer style={{ width: 304, height: 268, left: 0, top: 0, background: TASKS_BG, borderRadius: 130 }} />
      <Layer style={{ width: 260.85, height: 88.97, left: 19.82, top: 207.03, background: 'linear-gradient(180deg, #B8DCFC 0%, #BAE3FF 100%)' }} />
      <Layer style={{ width: 157, height: 112, left: 79, top: 76, background: '#FFFFFF' }} />
    </Face>
  ),
  'google-drive': (
    <Face w={294} h={272}>
      <Layer
        style={{
          width: 182.84,
          height: 198.94,
          left: 0,
          top: 73.06,
          background: 'linear-gradient(134.26deg, #3485F6 24.88%, #3285FD 54.85%, #AFA4FF 86.32%)',
        }}
      />
      <Layer
        style={{
          width: 229.76,
          height: 131.95,
          left: 32.22,
          top: 0,
          background: 'linear-gradient(74.21deg, #79C8FF 12.85%, #0FBC60 48.94%, #08BF62 75.13%)',
        }}
      />
      <Layer
        style={{
          width: 146.18,
          height: 198.67,
          left: 147.82,
          top: 73.33,
          background: 'linear-gradient(180deg, #F8C70B -0.21%, #FED710 51.04%, #FFDA15 102.3%)',
        }}
      />
    </Face>
  ),
  'google-docs': (
    <Face w={226} h={310}>
      <Layer style={{ width: 226, height: 310, left: 0, top: 0, background: DOCS_BG }} />
      <Layer style={{ width: 91.14, height: 92, left: 120, top: 0, background: '#76BBFF' }} />
      <Layer style={{ width: 114, height: 73, left: 56, top: 186, background: '#FFFCFF' }} />
    </Face>
  ),
  'google-sheets': (
    <Face w={310} h={226}>
      <Layer style={{ width: 282, height: 226, left: 28, top: 0, background: SHEETS_BG }} />
      <Layer style={{ width: 170, height: 136, left: 116, top: 66, background: '#FFFFFF' }} />
      <Layer style={{ width: 29.4, height: 177.38, left: 0, top: 24.31, background: '#019853' }} />
    </Face>
  ),
  'google-slides': (
    <Face w={298} h={286}>
      <Layer style={{ width: 298, height: 226.39, left: 0, top: 29.81, background: SLIDES_BG }} />
      <Layer style={{ width: 234.47, height: 29.81, left: 32.01, top: 0, background: 'linear-gradient(89.4deg, #FFDE14 21.09%, #F2D635 99.49%)' }} />
      <Layer style={{ width: 234.47, height: 29.8, left: 31.99, top: 256.2, background: 'linear-gradient(89.45deg, #FFC000 0.47%, #F8ACDB 85.87%)' }} />
      <Layer style={{ width: 204, height: 134.23, left: 46, top: 75.89, background: '#FFFFFF' }} />
    </Face>
  ),
  'google-photos': (
    <Face w={306} h={306}>
      <Layer
        style={{ width: 83.1, height: 153, left: 153, top: 0, background: 'radial-gradient(146.94% 100% at 0% 100%, #FE89D3 0%, #EB56A4 41.46%, #FE4141 80.39%, #FE413F 100%)' }}
      />
      <Layer
        style={{ width: 153, height: 83.1, left: 0, top: 69.9, background: 'radial-gradient(100% 146.94% at 100% 100%, #FFEA22 0%, #FFDB14 41.46%, #FEC802 80.39%, #FFD007 100%)' }}
      />
      <Layer
        style={{ width: 83.1, height: 153, left: 69.9, top: 153, background: 'radial-gradient(146.94% 100% at 100% 0%, #79C9FD 0%, #48BEBD 41.46%, #06B15F 80.39%, #02B058 100%)' }}
      />
      <Layer
        style={{ width: 153, height: 83.1, left: 153, top: 153, background: 'radial-gradient(100% 146.94% at 0% 0%, #A9A9FB 0%, #839CFC 41.46%, #418CFD 80.39%, #3287FF 100%)' }}
      />
    </Face>
  ),
};

export interface GoogleAppIconProps {
  appId: string;
  size?: number;
}

/** Renders one of the extracted Google-style app icons at a given pixel size. */
export function GoogleAppIcon({ appId, size = 48 }: GoogleAppIconProps) {
  if (!isGoogleApp(appId)) return null;
  return (
    <div className="shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      {ICONS[appId]}
    </div>
  );
}