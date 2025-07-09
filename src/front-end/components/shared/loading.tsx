import { createPortal } from "react-dom";

interface LoadingProps {
    loading: boolean;
}

export const Loading = ({ loading }: LoadingProps) => {

    return (
        createPortal(
            <div className="fixed inset-0 w-screen h-screen bg-black/75 flex items-center justify-center z-[9999]">
                <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center gap-6">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-minsait rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-xl">TF</span>
                        </div>
                        <p className="text-sm text-gray-500">Por favor, aguarde...</p>
                    </div>
                </div>
            </div>,
            document.body
        )
    );


};

export default Loading;