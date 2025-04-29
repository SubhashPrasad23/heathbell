-authRouter-
post-auth/signup - done
post-auth/login -done

POSt /users/:userId/AddPatients	Add new patient -done
GET	/users/:userId/patients	Get all patients
PUT	/users/:userId/patients/:patientId	Edit a patient
DELETE	/users/:userId/patients/:patientId	Delete a patient

-medicineRouter-
GET	/patients/:patientId/getAllmedicines	Get all medicines
POST	/patients/:patientId/AddMedicines	Add new medicine
PUT	/patients/:patientId/medicines/:medicineId	Edit medicine
DELETE	/patients/:patientId/medicines/:medicineId	Delete medicine


  {/* <div className="space-y-3 bg-white px-4 py-5 rounded-lg">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleSection("patients")}
              className="w-full flex items-center justify-between p-4 text-left font-medium"
            >
              <div className="flex items-center space-x-3">
                <User size={20} className="text-teal-600" />
                <span>Patients</span>
              </div>
              {expandedSection === "patients" ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            <AnimatePresence>
              {expandedSection === "patients" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t-2 border-teal-500">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Manage Patients</h3>
                    </div>

                    {editingPatient && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 border border-teal-200 rounded-lg p-4 bg-teal-50"
                      >
                        <h3 className="text-lg font-medium text-teal-700 mb-4">
                          Edit Patient
                        </h3>
                        <form onSubmit={handleUpdate}>
                          <div className="space-y-3 mb-4">
                            <div>
                              <label className="block text-gray-700 font-medium mb-1 text-sm">
                                Patient Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-gray-700 font-medium mb-1 text-sm">
                                Age
                              </label>
                              <input
                                type="number"
                                name="age"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-gray-700 font-medium mb-1 text-sm">
                                Gender
                              </label>
                              <select
                                name="gender"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                required
                              >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-gray-700 font-medium mb-1 text-sm">
                                Contact Number
                              </label>
                              <input
                                type="text"
                                name="contact"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-gray-700 font-medium mb-1 text-sm">
                                Notes (Optional)
                              </label>
                              <textarea
                                name="notes"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[60px] text-sm"
                              ></textarea>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm"
                            >
                              Save Changes
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}

                    <motion.div
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="space-y-3"
                    >
                      <div className="text-center py-6">
                        <User
                          size={36}
                          className="mx-auto text-gray-400 mb-2"
                        />
                        <p className="text-gray-600">No patients added yet</p>
                        <button
                          onClick={() => toggleSection("add_patient")}
                          className="mt-3 px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm"
                        >
                          Add Your First Patient
                        </button>
                      </div>
                      <motion.div variants={item}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1 cursor-pointer">
                            <h3 className="font-bold text-teal-700">name</h3>
                            <p className="text-gray-600 text-sm">
                              Age: | Gender:
                            </p>
                            <p className="text-gray-600 text-sm">
                              Contact: contact
                            </p>
                            <p className="text-gray-600 text-sm mt-1">notes</p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-teal-100 text-teal-800 text-xs rounded-full">
                              Currently Selected
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              className="p-1.5 rounded-full bg-teal-100 text-teal-700 hover:bg-teal-200"
                            >
                              <Edit size={16} />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              className="p-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleSection("add_patient")}
              className="w-full flex items-center justify-between p-4 text-left font-medium"
            >
              <div className="flex items-center space-x-3">
                <UserPlus size={20} className="text-teal-600" />
                <span>Add Patient</span>
              </div>
              {expandedSection === "add_patient" ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            <AnimatePresence>
              {expandedSection === "add_patient" && (
                <AddPatient formData={formData} setFormData={setFormData} />
              )}
            </AnimatePresence>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleSection("notifications")}
              className="w-full flex items-center justify-between p-4 text-left font-medium"
            >
              <div className="flex items-center space-x-3">
                <Bell size={20} className="text-teal-600" />
                <span>Notifications</span>
              </div>
              {expandedSection === "notifications" ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            <AnimatePresence>
              {expandedSection === "notifications" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t-2 border-teal-500">
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">
                              Medicine Reminders
                            </p>
                            <p className="text-xs text-gray-500">
                              Get notified when it's time to take medicine
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">Refill Alerts</p>
                            <p className="text-xs text-gray-500">
                              Get notified when medicine needs to be refilled
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">
                              Appointment Reminders
                            </p>
                            <p className="text-xs text-gray-500">
                              Get notified about upcoming appointments
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                          </label>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium mb-3 text-sm">
                          Notification Methods
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              id="push"
                              type="checkbox"
                              checked
                              className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                            />
                            <label
                              htmlFor="push"
                              className="ml-2 text-sm font-medium text-gray-900"
                            >
                              Push Notifications
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="email"
                              type="checkbox"
                              className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                            />
                            <label
                              htmlFor="email"
                              className="ml-2 text-sm font-medium text-gray-900"
                            >
                              Email Notifications
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="sms"
                              type="checkbox"
                              className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                            />
                            <label
                              htmlFor="sms"
                              className="ml-2 text-sm font-medium text-gray-900"
                            >
                              SMS Notifications
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button className="w-full flex items-center space-x-3 p-4 text-left font-medium text-red-500 hover:bg-red-50">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div> */}