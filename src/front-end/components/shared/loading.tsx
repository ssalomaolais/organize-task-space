import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/CalendarView.css";

interface LoadingProps {
    loading: boolean;
}

export const Loading = ({ loading }: LoadingProps) => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 bg-minsait rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">TF</span>
                </div>
                <p className="text-gray-600">Carregando...</p>
            </div>
        </div>

    );
};

export default Loading;