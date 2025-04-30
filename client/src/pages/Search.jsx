import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { SearchIcon } from "lucide-react";
import Loading from "../components/Loading";
import SectionCard from "../components/SectionCard";
import InfoItem from "../components/InfoItem";

const Search = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [medicineData, setMedicineData] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/search/medicineInfo`,
        { name },
        { withCredentials: true }
      );
      console.log(response);

      if (response.data?.data?.error) {
        setError(response.data?.data.error);
        setMedicineData(null);
      }
      setMedicineData(response.data?.data);
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full h-full flex flex-col flex-1 text-Montserrat">
      <div>
        <p className="text-teal-700 text-lg font-semibold mb-2">
          Find detailed information about any medicine
        </p>
        <div className="bg-white rounded-xl transition-all duration-300">
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for a medicine..."
              className="w-full p-4 pl-14 pr-36  outline-none text-sm"
            />
            <SearchIcon
              className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-500"
              size={22}
            />
            <button
              onClick={handleSearch}
              disabled={!name}
              className="disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed absolute right-3 top-1/2 -translate-y-1/2 bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="h-full flex-1 pt-5 flex-col overflow-auto hideScrollbar">
        {loading ? (
          <Loading />
        ) : (
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200 max-w-xl mx-auto"
              >
                {error}
              </motion.div>
            ) : (
              medicineData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-black"
                >
                  <div className="p-4 space-y-6 text-sm md:text-base">
                    <h2 className="text-2xl p-2 font-bold text-teal-700 bg-white rounded-lg shadow-[2px_2px_0px_3px_teal]">
                      {medicineData.name}
                    </h2>

                    <div className="space-y-5">
                      <SectionCard title="Basic Information">
                        <InfoItem
                          title="Types / Forms"
                          content={medicineData.forms}
                        />
                        <InfoItem
                          title="How It Works"
                          content={medicineData.how_it_works}
                        />
                        <InfoItem
                          title="How it is made"
                          content={medicineData.how_it_is_made}
                        />
                      </SectionCard>

                      <SectionCard title="Usage & Benefits">
                        <InfoItem title="Uses" content={medicineData.uses} />
                        <InfoItem
                          title="Benefits"
                          content={medicineData.benefits}
                        />
                      </SectionCard>

                      <SectionCard title="Side Effects">
                        <InfoItem
                          title="Common side effects"
                          content={medicineData.common_side_effects}
                        />
                        <InfoItem
                          title="Serious side effects"
                          content={medicineData.serious_side_effects}
                        />
                        <InfoItem
                          title="Who should avoid"
                          content={medicineData.who_should_avoid}
                        />
                      </SectionCard>

                      <SectionCard title="Additional Safety Info">
                        <InfoItem
                          title="Missed Dose"
                          content={medicineData.Missed_Dose}
                        />
                        <InfoItem
                          title="Overdose"
                          content={medicineData.overdose}
                        />
                        <InfoItem
                          title="Storage"
                          content={medicineData.Storage}
                        />
                        <InfoItem
                          title="Important Advice"
                          content={medicineData.important_advice}
                        />
                      </SectionCard>

                      <SectionCard title="Other">
                        <InfoItem
                          title="Similar medicines"
                          content={medicineData.similar_medicines}
                        />
                        <InfoItem
                          title="Interactions"
                          content={medicineData.interactions}
                        />
                        <InfoItem
                          title="Warnings and precautions"
                          content={medicineData.Warnings_and_precautions}
                          isWarning
                        />
                      </SectionCard>
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Search;
