import { useState } from "react";
import type { TaskResponse } from "../../types";
 import { FileText } from "lucide-react";
import { markTaskAsCompleted } from "../../services/taskAPI";
import { useSelector } from "react-redux";


export default function TaskCard({ task } : { task : TaskResponse}) {

    const [readDocs, setReadDocs] = useState<string[]>([]);
    const { token } = useSelector((state: any) => state.auth);

    const handleMarkAsRead = async (docUrl: string) => {
            if (readDocs.includes(docUrl)) return; 

                try {
                    await markTaskAsCompleted({ token: token, id: task.id });
                    setReadDocs((prev) => [...prev, docUrl]);
                } catch (error) {
                    console.error("Error marking doc as read:", error);
            }
    };
    
    return (
        <div  className="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg shadow-2xs shadow-gray-400 hover:scale-95 transition duration-100">
             <div className="flex justify-between flex-row gap-2">
                <div className="flex flex-col gap-2">
                    <p className="text-xl font-semibold">{task.title}</p>
                    <p className="text-sm">{task.description}</p>
                </div>
                <p className="text-lg text-gray-500">Assigned to : {task.assignedTo}</p>
             </div>

            <div className="flex gap-2">
                <div className="flex gap-4">
                    {Array.isArray(task.documents) && task.documents.length > 0 &&
                        task.documents.map((file: string, idx: number) => (
                            <div>
                                 <a
                                    key={idx}
                                    href={file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-blue-600 hover:underline" 
                                     onClick={() => handleMarkAsRead(file)}
                                     >
                                    
                                    <FileText className="w-5 h-5" />
                                    Document {idx + 1}
                                </a>
                                  {/* Read Status */}
                                <p className="text-xs mt-1">
                                    {readDocs.includes(file) ? "✅ Read" : "📖 Not read"}
                                </p>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="flex justify-between">
                <p className="text-lg text-gray-500">Due Date : {new Date(task.dueDate).toLocaleDateString()}</p>
               <div className="flex gap-5 text-lg text-gray-500">
                 <p className="font-semibold">{task.status}</p>
                 <p className="font-semibold">{task.priority}</p>
               </div>
            </div>
        </div>
    )
}