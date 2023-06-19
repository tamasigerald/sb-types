type Logger = {
  info: (message: any, colored?: boolean) => void;
  error: (message: any) => void;
  warn: (message: any) => void;
  success: (message: any) => void;
};

declare global {
  var logger: Logger;
}

export {};
