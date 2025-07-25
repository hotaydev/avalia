import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

export default function DialogComponent({
  open,
  setOpen,
  title,
  children,
  buttonText = "Entendido",
  onClick,
  titleCentered = false,
}: Readonly<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  children?: ReactNode;
  buttonText?: string;
  onClick?: () => void;
  titleCentered?: boolean;
}>) {
  return (
    <Dialog className="relative z-10" open={open} onClose={setOpen}>
      <DialogBackdrop
        transition={true}
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition={true}
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in sm:my-8 sm:w-full sm:max-w-xl sm:data-closed:translate-y-0 sm:data-closed:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="flex items-start w-full">
                <div className={`mt-3 text-center sm:ml-4 sm:mt-0 ${titleCentered ? "" : "sm:text-left"} w-full`}>
                  <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                    {title}
                  </DialogTitle>
                  <div className="mt-2 text-sm text-gray-500 w-full">{children}</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-center sm:px-6">
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 focus:outline-hidden transition-all hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer"
                onClick={() => {
                  if (onClick) {
                    onClick();
                  }
                  setOpen(false);
                }}
                data-autofocus={true}
              >
                {buttonText}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
