type TypeWriterOptions = {
  text: string;
  speed?: number; 
  onUpdate: (value: string) => void;
  onDone?: () => void;
};

export const TypeWriter = async ({
  text,
  speed = 5,
  onUpdate,
  onDone
}: TypeWriterOptions) => {
  let current = "";

  for (let i = 0; i < text.length; i++) {
    current += text[i];
    onUpdate(current);
    await new Promise(res => setTimeout(res, speed));
  }

  onDone?.();
};
