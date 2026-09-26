# Simulated UI Mockup Components for Remotion

> [!CAUTION]
> **Anti-AI Slop & Anti-Trademark Invariant**:
> 1. **Never use AI image generators** to generate fake software interfaces, terminal screens, app dashboards, or scanning hands. AI generators output deformed anatomy and gibberish pseudo-text (`screnvmoshot`, `Textute Faint`, `ACQUIRING 3D MESN`...) that trigger YouTube/TikTok's automated inauthentic content & AI slop filters, crushing video reach.
> 2. **Never include commercial brand logos** (e.g. Nike Swoosh, Apple, Adidas, etc.) in demo objects or mockups. Automated computer vision trademark filters will penalize or shadow-ban the video. Always use unbranded, generic items.
> 3. Always use real screenshots from the repo README or build clean code-rendered CSS/SVG mockups below.

When a repository lacks high-resolution screenshots, use these simulated UI components to visually showcase the tool in action.

---

## 1. Simulated Terminal CLI Mockup

Displays a macOS/Linux developer terminal with window controls, typed CLI command, and animated glowing logs.

```tsx
import {interpolate, useCurrentFrame, Easing} from 'remotion';

export const TerminalMockup: React.FC<{
  command: string;
  outputLines: string[];
  title?: string;
}> = ({command, outputLines, title = 'bash - 80x24'}) => {
  const frame = useCurrentFrame();

  // Typing effect for the command
  const charsShown = Math.floor(
    interpolate(frame, [15, 45], [0, command.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const currentCommand = command.substring(0, charsShown);

  return (
    <div
      style={{
        borderRadius: 24,
        overflow: 'hidden',
        border: '1px solid rgba(88,166,255,0.3)',
        backgroundColor: '#090d13',
        boxShadow: '0 30px 90px rgba(0,0,0,0.8)',
        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
      }}
    >
      {/* Terminal Titlebar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          backgroundColor: '#161b22',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{display: 'flex', gap: 8}}>
          <div style={{width: 13, height: 13, borderRadius: 99, background: '#ff5f56'}} />
          <div style={{width: 13, height: 13, borderRadius: 99, background: '#ffbd2e'}} />
          <div style={{width: 13, height: 13, borderRadius: 99, background: '#27c93f'}} />
        </div>
        <span style={{color: '#8b949e', fontSize: 18, fontWeight: 600}}>{title}</span>
        <div style={{width: 50}} />
      </div>

      {/* Terminal Body */}
      <div style={{padding: '24px 28px', fontSize: 24, lineHeight: 1.6}}>
        <div style={{color: '#e6edf3', display: 'flex', alignItems: 'center', gap: 10}}>
          <span style={{color: '#39d353', fontWeight: 800}}>➜</span>
          <span style={{color: '#58a6ff', fontWeight: 700}}>~/project</span>
          <span>$ {currentCommand}</span>
          {frame < 55 && <span style={{opacity: frame % 15 < 8 ? 1 : 0, color: '#39d353'}}>▋</span>}
        </div>

        {/* Output lines appearing sequentially */}
        <div style={{marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8}}>
          {outputLines.map((line, idx) => {
            const lineStart = 50 + idx * 12;
            const opacity = interpolate(frame, [lineStart, lineStart + 8], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            if (frame < lineStart) return null;
            return (
              <div key={idx} style={{opacity, color: '#8b949e'}}>
                {line}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
```

---

## 2. Simulated Code Editor (VS Code Style)

Displays an active editor tab, line numbers, and clean colored code tokens.

```tsx
export const CodeEditorMockup: React.FC<{
  filename: string;
  codeSnippet: Array<{num: number; tokens: Array<{text: string; color: string}>}>;
}> = ({filename, codeSnippet}) => {
  return (
    <div
      style={{
        borderRadius: 24,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.15)',
        backgroundColor: '#1e1e1e',
        boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
        fontFamily: 'Consolas, Monaco, monospace',
      }}
    >
      {/* Editor Tab */}
      <div style={{display: 'flex', background: '#252526', borderBottom: '1px solid #333'}}>
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: '#1e1e1e',
            color: '#e6edf3',
            fontSize: 20,
            fontWeight: 600,
            borderTop: '2px solid #007acc',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{color: '#58a6ff'}}>TS</span>
          <span>{filename}</span>
        </div>
      </div>

      {/* Code Area */}
      <div style={{padding: '20px 24px', fontSize: 23, lineHeight: 1.7}}>
        {codeSnippet.map((row) => (
          <div key={row.num} style={{display: 'flex', gap: 24}}>
            <span style={{color: '#5c6370', width: 28, textAlign: 'right', userSelect: 'none'}}>
              {row.num}
            </span>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
              {row.tokens.map((t, i) => (
                <span key={i} style={{color: t.color, fontWeight: t.color === '#58a6ff' ? 700 : 500}}>
                  {t.text}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 3. Real Screenshot Frame Wrapper

When wrapping a real image from the repository, use this container to make it look like an authentic macOS desktop application:

```tsx
import {Img, staticFile, interpolate, useCurrentFrame} from 'remotion';

export const ScreenshotWindow: React.FC<{
  imageSrc: string;
  title: string;
}> = ({imageSrc, title}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 200], [1.0, 1.06]);

  return (
    <div
      style={{
        borderRadius: 24,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.2)',
        backgroundColor: '#161b22',
        boxShadow: '0 35px 100px rgba(0,0,0,0.85)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          background: '#0d1117',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{display: 'flex', gap: 8}}>
          <div style={{width: 12, height: 12, borderRadius: 99, background: '#ff5f56'}} />
          <div style={{width: 12, height: 12, borderRadius: 99, background: '#ffbd2e'}} />
          <div style={{width: 12, height: 12, borderRadius: 99, background: '#27c93f'}} />
        </div>
        <span style={{fontSize: 18, color: '#8b949e', fontWeight: 600}}>{title}</span>
        <div style={{width: 48}} />
      </div>
      <div style={{overflow: 'hidden'}}>
        <Img
          src={staticFile(imageSrc)}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            transform: `scale(${zoom})`,
          }}
        />
      </div>
    </div>
  );
};
```
