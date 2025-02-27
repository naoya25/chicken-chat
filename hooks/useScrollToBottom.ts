import { useEffect, useRef, RefObject } from "react";

interface ScrollToBottomProps {
  // 初回読み込み時はスムーズスクロールではなく即座にスクロールするかどうか
  smoothOnMount?: boolean;
}

export function useScrollToBottom<T extends HTMLElement>({
  smoothOnMount = false,
}: ScrollToBottomProps): RefObject<T> {
  const endRef = useRef<T>(null);
  const isFirstRender = useRef(true);

  // 依存配列が変化するたびにスクロール
  useEffect(() => {
    if (endRef.current) {
      const behavior =
        isFirstRender.current && !smoothOnMount ? "auto" : "smooth";
      endRef.current.scrollIntoView({ behavior });
      isFirstRender.current = false;
    }
  }, [smoothOnMount]);

  return endRef as RefObject<T>;
}
