import { useRef, useState } from "react";

interface Clicked {
    line: number;
    character: number;
}

function DocView() {
    const ref = useRef<HTMLParagraphElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [text, setText] = useState<string[]>([
        "# title",
        "hello",
        "world",
        "This is a very long string",
    ]);
    const [clicked, setClicked] = useState<Clicked>({ line: 0, character: 0 });
    const [firstFocus, setFirstFocus] = useState(false);

    const handleClick: React.MouseEventHandler<HTMLParagraphElement> = (e) => {
        // Get the caret position
        const range = (document as any).caretPositionFromPoint(
            e.clientX,
            e.clientY
        );

        if (range && range.offsetNode) {
            if (range.offsetNode.nodeName === "#text") {
                const line = Number(range.offsetNode.parentNode.id.slice(5));
                setClicked({
                    line,
                    character: range.offset + calcTextOffset(line),
                });
            } else if (range.offsetNode.id.startsWith("line-")) {
                const line = Number(range.offsetNode.id.slice(5));
                setClicked({
                    line,
                    character: text[line].length,
                });
            } else {
                return;
            }
            setFirstFocus(true);
        }
    };

    const calcTextOffset = (i: number) => {
        if (text[i].startsWith("# ")) {
            return 2;
        } else if (text[i].startsWith("## ")) {
            return 3;
        } else if (text[i].startsWith("### ")) {
            return 4;
        }
        return 0;
    };

    const getBolding = (i: number) => {
        if (text[i].startsWith("# ")) {
            return "text-3xl h-[36px]";
        } else if (text[i].startsWith("## ")) {
            return "text-2xl h-[32px]";
        } else if (text[i].startsWith("### ")) {
            return "text-xl h-[28px] font-bold text-slate-800";
        }
        return "h-[24px]";
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
        e
    ) => {
        e.stopPropagation();

        // TODO: Handle enter (new line)
        // TODO: Handle backspace (if at beginning or line is empty)
    };

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        const newLine = e.target.value;
        const newLines = [...text];
        newLines[clicked.line] = newLine;
        setText(newLines);
    };

    const handleFocus: React.FocusEventHandler<HTMLTextAreaElement> = (e) => {
        if (firstFocus) {
            const input = e.target;
            input.setSelectionRange(clicked.character, clicked.character);
            setFirstFocus(false);
        }
    };

    return (
        <div className="bg-slate-200 h-max min-h-full w-full px-[20%]">
            <div className="bg-slate-100 w-full min-h-[100vh] p-4 flex flex-col">
                <p className="grow cursor-text" ref={ref} onClick={handleClick}>
                    {text.map((t, i) => {
                        if (i === clicked.line) {
                            return (
                                <>
                                    <textarea
                                        id={"input-" + i}
                                        value={t}
                                        onKeyDown={handleKeyDown}
                                        onChange={handleChange}
                                        onFocusCapture={handleFocus}
                                        className={
                                            "bg-slate-100 w-full resize-none outline-none " +
                                            getBolding(i)
                                        }
                                        ref={inputRef}
                                        autoFocus
                                    />
                                    <br />
                                </>
                            );
                        }
                        return (
                            <span id={"line-" + i} className={getBolding(i)}>
                                {t.replace(/^#+ /g, "")}
                                <br />
                            </span>
                        );
                    })}
                </p>
                <button
                    onClick={() => {
                        console.log(ref.current?.innerHTML);
                    }}
                >
                    Show
                </button>
            </div>
        </div>
    );
}

export default DocView;
