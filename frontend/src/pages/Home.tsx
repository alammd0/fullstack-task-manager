import FilterNavBar from "../components/home/FilterNavBar";
import TaskSection from "../components/home/TaskSection";


export default function Home() {
  return (
    <div className="bg-gray-300 pt-5 min-h-screen pb-10">
      <div className="bg-gray-100 max-w-[90%] mx-auto px-4 py-6 rounded-xl shadow-md min-h-screen space-y-5">
        <FilterNavBar />
        <TaskSection />
      </div>
    </div>
  );
}
