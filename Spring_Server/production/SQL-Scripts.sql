use drvolte;


insert into doctor (id, dob, hospital_address, hospital_name, name, profile_photo, qualification, specialization, email, languagues, status) values(1, '1999-01-22', '16/6, Millers Rd, Kaverappa Layout, Vasanth Nagar, Bengaluru, Karnataka 560052', 'KMC', 'Hemant Kumar', '../src/pages/assets/images/doctor-1.png', 'MD', 'Cardiovascular', 'Hemant.Kumar@kmc.co.in', '["Hindi", "English", "Konkani"]', "enabled");
insert into doctor (id, dob, hospital_address, hospital_name, name, profile_photo, qualification, specialization, email, languagues, status) values(2, '1995-12-31', 'Survey no 45/2, ward. 150, Marathahalli - Sarjapur Rd, opposite Iblur, Ambalipura, Bellandur, Bengaluru, Karnataka 560102', 'Columbia Asia', 'Gururaj Otageri', '../src/pages/assets/images/doctor-2.png', 'MD', 'Neurology', 'Gururaj.Otageri@columasia.co.in', '["Hindi", "English", "Kannada"]', "enabled");
insert into doctor (id, dob, hospital_address, hospital_name, name, profile_photo, qualification, specialization, email, languagues, status) values(3, '2000-04-22', 'Survey no 45/2, ward. 150, Marathahalli - Sarjapur Rd, opposite Iblur, Ambalipura, Bellandur, Bengaluru, Karnataka 560102', 'Columbia Asia', 'Somesh Awasthi', '../src/pages/assets/images/doctor-3.png', 'MBBS', 'Dental', 'Somesh.Awasthi@columasia.co.in', '["Hindi", "English", "Chhattisgarhi"]', "disabled");
insert into doctor (id, dob, hospital_address, hospital_name, name, profile_photo, qualification, specialization, email, languagues, status) values(4, '2000-05-01', '16/6, Millers Rd, Kaverappa Layout, Vasanth Nagar, Bengaluru, Karnataka 560052', 'KMC', 'Karndevsinh Zala', '../src/pages/assets/images/doctor-3.png', 'MD', 'Mental Pyschology', 'Karn.Zala@columasia.co.in', '["Hindi", "English", "Gujarathi"]', "enabled");

insert into doctor (id, dob, hospital_address, hospital_name, name, profile_photo, qualification, specialization, email, languagues, status) values(5, '1994-06-16', '16/6, Millers Rd, Kaverappa Layout, Vasanth Nagar, Bengaluru, Karnataka 560052', 'KMC', 'Varun Shetty', '../src/pages/assets/images/doctor-3.png', 'MD', 'Neurology', 'Varun.Shetty@columasia.co.in', '["Hindi", "English", "Tulu"]', "enabled");
insert into doctor (id, dob, hospital_address, hospital_name, name, profile_photo, qualification, specialization, email, languagues, status) values(6, '1993-07-20', '16/6, Millers Rd, Kaverappa Layout, Vasanth Nagar, Bengaluru, Karnataka 560052', 'KMC', 'Nikhil Joshi', '../src/pages/assets/images/doctor-3.png', 'MD', 'Pediatrics', 'Nikhil.Joshi@columasia.co.in', '["Hindi", "English", "Marathi"]', "enabled");


insert into counsellor values(1);
insert into counsellor values(2);
insert into counsellor values(3);	
insert into counsellor values(4);

insert into senior_dr values(5);
insert into senior_dr values(6);


insert into patient (id, allergies, blood_group, dob, languague, location, major_issues, minor_issues, name, ph_no, state) values(1, 'nil', 'AB-', '23 Jan 1952', 'English', 'Bengaluru', 'Heart related issues', 'Blood Pressure, Cholestrol', 'Donald Trump', '7019273903', 'Karnataka');
insert into patient (id, allergies, blood_group, dob, languague, location, major_issues, minor_issues, name, ph_no, state) values(2, 'nil', 'O-', '23 Jan 1949', 'English', 'Mumbai', 'Neurological Disorders', 'Blood Pressure', 'Joe Biden', '9845323134', 'Maharashtra');	
insert into patient (id, allergies, blood_group, dob, languague, location, major_issues, minor_issues, name, ph_no, state) values(3, 'Nut Allergy, Dust Allergy', 'O+', '19 May 1981', 'English', 'Hyderabad', 'nil', 'Blood Pressure', 'Vivek Ramaswamy', '9738523214', 'Telangana');
insert into patient (id, allergies, blood_group, dob, languague, location, major_issues, minor_issues, name, ph_no, state) values(4, 'Nut Allergy, Dust Allergy', 'O+', '01 Aug 1972', 'English', 'Kolkata', 'Mental Health Disorders', 'Blood Pressure', 'Barack Obama', '9743657687', 'West Bengal');


insert into callbacks (id, followup_reason, schedule, counsellor_id) values(1, "Followup callback to see how the patient is responding to the treatment", '2024-04-30 12:00:00.000000', 1);
insert into callbacks (id, followup_reason, schedule, counsellor_id) values(2, "Followup callback to see how the patient is responding to the prescribed medicine", '2024-10-01 12:00:00.000000', 2);
insert into callbacks (id, followup_reason, schedule, counsellor_id) values(3, "Followup callback for the patients routine checkup.", '2024-04-15 12:00:00.000000', 3);
insert into callbacks (id, followup_reason, schedule, counsellor_id) values(4, "Followup callback to see how the patient is responding to change in treatment", '2024-05-01 12:00:00.000000', 4);


insert into call_history(id, call_end, call_start, counsellor_id, patient_id) values(1, '2024-04-01 12:00:00.000000', '2024-04-01 11:30:00.000000', 1, 1);
insert into call_history(id, call_end, call_start, counsellor_id, patient_id) values(2, '2024-04-02 11:30:00.000000', '2024-04-01 10:30:00.000000', 2, 2);
insert into call_history(id, call_end, call_start, counsellor_id, patient_id) values(3, '2024-04-03 14:30:00.000000', '2024-04-01 14:00:00.000000', 3, 3);
insert into call_history(id, call_end, call_start, counsellor_id, patient_id) values(4, '2024-04-04 17:00:00.000000', '2024-04-01 16:40:00.000000', 4, 4);


insert into patient_history (id, audio_recording, consent, created, prescription, summanry, symptoms, patient_id) values(1, '../src/pages/assets/recordings/recording-1.mp4', 1,  '2024-04-01 11:30:00.000000', 'Beta Blockers - Metoprolol : 1 time every day for a month','The patient reported his first experience of chest discomfort. Although, it is too late to tell what caused this exactly, I have prescribed him Beta-blockers to do away with the pain for the time being.','Chest discomfort or pain that may feel like pressure, squeezing, fullness, or tightness.', 1);
insert into patient_history (id, audio_recording, consent, created, prescription, summanry, symptoms, patient_id) values(2, '../src/pages/assets/recordings/recording-2.mp4', 1,  '2024-04-02 10:30:00.000000', 'Dopamine agonists - Pramipexole : 1 time every day for 6 months, COMT inhibitors - Entacapone : 2 times a day every day for 6 months','The patient is showing early signs of Parkinsons Disease. Suggested COMT inhibitors to manage the motor symptoms and Dopamine agonists to do away with the pain. Will monitor patient condition over the course of 6 months','Tremors, stiffness, bradykinesia (slowness of movement), postural instability, difficulty with balance and coordination.', 2);
insert into patient_history (id, audio_recording, consent, created, prescription, summanry, symptoms, patient_id) values(3, '../src/pages/assets/recordings/recording-3.mp4', 1,  '2024-04-03 14:00:00.000000', 'nil','Patient is experiencing severe tooth pain and we are now proceeding for a root canal treatment','Patient has lost a tooth', 3);
insert into patient_history (id, audio_recording, consent, created, prescription, summanry, symptoms, patient_id) values(4, '../src/pages/assets/recordings/recording-4.mp4', 0,  '2024-04-03 16:40:00.000000', 'Benzodiazepines : 2 times a day for 1 month, Selective serotonin reuptake inhibitors (SSRIs) - Escitalopram : 2 times a day for 1 month','Patient is experiencing severe degree of anxiety disorder based symptoms and has been ordered to take the prescribed treatment to provide short term relief and several other hormone uptake inhibhitors.','Excessive worry or fear, restlessness, irritability, muscle tension, difficulty concentrating, sleep disturbances, panic attacks (sudden onset of intense fear or discomfort).', 4);


insert into users (id, enable, name, password, role, username) values (1, 1, 'Hemant Kumar', 'hemant', 'ROLE_COUNSELLOR', 'Hemant.Kumar@kmc.co.in');
insert into users (id, enable, name, password, role, username) values (2, 1, 'Gururaj Otageri', 'guru', 'ROLE_COUNSELLOR', 'Gururaj.Otageri@columasia.co.in');
insert into users (id, enable, name, password, role, username) values (3, 1, 'Somesh Awasthi', 'somesh', 'ROLE_COUNSELLOR', 'Somesh.Awasthi@columasia.co.in');
insert into users (id, enable, name, password, role, username) values (4, 1, 'Karndevsinh Zala', 'karnadevsinh', 'ROLE_COUNSELLOR', 'Karn.Zala@columasia.co.in');
insert into users (id, enable, name, password, role, username) values (5, 1, 'Varun Shetty', 'varun', 'ROLE_SENIORDR', 'Varun.Shetty@columasia.co.in');
insert into users (id, enable, name, password, role, username) values (6, 1, 'Nikhil Joshi', 'nikhil', 'ROLE_SENIORDR', 'Nikhil.Joshi@columasia.co.in');
insert into users (id, enable, name, password, role, username) values (7, 1, 'Someone', 'admin', 'ROLE_ADMIN', 'admin@drvolte');
