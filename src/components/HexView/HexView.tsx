import React from 'react';
import styles from './HexView.module.css';

interface HexViewProps {
  hexDump: string;
  bytesPerLine?: number;
  highlightedRanges?: Array<{
    start: number;
    length: number;
    color?: string;
  }>;
  interactive?: boolean;
  onByteClick?: (offset: number) => void;
}

const byteToAscii = (byte: number): string => {
  if (byte >= 32 && byte <= 126) return String.fromCharCode(byte);
  return '.';
};

const HexView: React.FC<HexViewProps> = ({
  hexDump,
  bytesPerLine = 16,
  highlightedRanges = [],
  interactive = false,
  onByteClick = () => {}
}) => {
  // Parse hex dump into bytes (numbers 0-255)
  const byteValues = hexDump
    .split(' ')
    .filter((byte: string) => byte.trim().length === 2)
    .map((byte: string) => parseInt(byte, 16));

  // Check if a byte is in any highlighted range
  const isHighlighted = (index: number) => {
    return highlightedRanges.some(range => 
      index >= range.start && index < range.start + range.length
    );
  };

  // Get highlight color for a byte (if any)
  const getHighlightColor = (index: number) => {
    const range = highlightedRanges.find(r => 
      index >= r.start && index < r.start + r.length
    );
    return range?.color || 'var(--primary-color)';
  };

  const renderLines = () => {
    const lines = [];
    for (let i = 0; i < byteValues.length; i += bytesPerLine) {
      const lineBytes = byteValues.slice(i, i + bytesPerLine);
      const offset = i.toString(16).padStart(4, '0');

      const hexSpans = lineBytes.map((byte: number, indexInLine: number) => {
        const absoluteIndex = i + indexInLine;
        const highlighted = isHighlighted(absoluteIndex);
        
        return (
          <span 
            key={`hex-${absoluteIndex}`}
            className={`${styles.byte} ${highlighted ? styles.byteHighlighted : ''}`}
            style={highlighted ? {backgroundColor: getHighlightColor(absoluteIndex)} : {}}
            onClick={interactive ? () => onByteClick(absoluteIndex) : undefined}
          >
            {byte.toString(16).padStart(2, '0')}
          </span>
        );
      });

      const asciiSpans = lineBytes.map((byte: number, indexInLine: number) => {
        const absoluteIndex = i + indexInLine;
        const highlighted = isHighlighted(absoluteIndex);
        
        return (
          <span 
            key={`ascii-${absoluteIndex}`}
            className={`${styles.asciiChar} ${highlighted ? styles.asciiHighlighted : ''}`}
            style={highlighted ? {backgroundColor: getHighlightColor(absoluteIndex)} : {}}
          >
            {byteToAscii(byte)}
          </span>
        );
      });

      // Pad lines if shorter than bytesPerLine
      while (hexSpans.length < bytesPerLine) {
        hexSpans.push(<span key={`pad-hex-${i}-${hexSpans.length}`} className={styles.bytePad}>  </span>);
      }
      while (asciiSpans.length < bytesPerLine) {
        asciiSpans.push(<span key={`pad-ascii-${i}-${asciiSpans.length}`} className={styles.asciiPad}> </span>);
      }

      lines.push(
        <div key={`line-${i}`} className={styles.hexLine}>
          <span className={styles.offset}>{offset}</span>
          <span className={styles.hexBytes}>{hexSpans}</span>
          <span className={styles.asciiChars}>{asciiSpans}</span>
        </div>
      );
    }
    return lines;
  };

  return (
    <div className={`${styles.hexView} ${interactive ? styles.interactive : ''}`}>
      {renderLines()}
    </div>
  );
};

export default HexView;