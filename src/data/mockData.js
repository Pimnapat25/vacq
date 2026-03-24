/**
 * Mock data aligned with stitch_backend_overview_design_requirements mockups.
 */

export const login = {
  heroAvatars: [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA6JMkmnmjcsJnRhwkR7FGEUVmlJ3YpgWCQJB_dB_80kI0fkEaHzq5oYYdbBpDtodm7GCGsUnlJCBfFAhbJfh2eD-CXB-Q1k4IhFGnthddTQI61LR-MQ_ZIlA1v_tSGODj3pjjGAPAEUZ5DgGG0R74IkQS7LMhFbh8nfCZ-g4kRAE3D0OT-o51gCVHpbqtGWHr3xDB5qGvVj0ZvPaC31FhnVu1Tq-D0f9cXOFym88l9Bo6fkbK7pXXZaBx3NALa1lQkFN859qr-ohzq",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB6fzKzjeBgsj9cNI8UuJ1p9rlD8psCuH21IY4eHk2KupgTTmCV2nE5OCTmlMlDkkjh8yhyPUyJAPAvJnOihq-GwjSI-UuLc66jqraqwmurVp7r-x2OXq6v5M2ORVETNRij7XpOA9Ipami51hXXtJoV6MM_q49e3Ydzy9yQOJ6vY_g97etGRMNgrSsXCi9_WQLidHBMibItF7c3oQ23u1w7s_wzUh2q0WSpfDjATDQi4fYA3B9n6xdKdSRCeBMxjwlzDICsIa7O_56v",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBFzcD3Se85mP3_4vZYc1x0ySVTHzr4TgB5CEwJXxQao-1sfpkAVpAlX6aiAXIYKchDjV10t8D8Z6lWvQbvO0PFC5_ZrSzkaRcbS3a4a8b8a9lHoO568SGQ9TdmZHmhlQNmxTS1SP-WHIoUQ4MSSXs2NtWaDIM-y8fDfQpQb_J82s_DpANdFHD6VNXWSQqrP5lt9ouT-_ZSl72mImQ25e67JbxStKJB7Bvw1Nra04YFL0-JO1eMW2pHqzGpY_MriSYbMgH2W5SAEada"
  ],
  heroImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDXYZj454XqimfeymYYFTF1V44kIbUbd4CPYlZxUKxDGArUqd4be2a40ChiW5Rm_6xu0ULRz6koPoEa_r29udcyx3JxIZ5Lp9lPp6vfYv21bb2wuYz1MnoCQhBex1m0esPFEVn4Fe4XU3LjjufxHOdNwpzMhJCs5xQseFdR9CkJB24vPytweSvKNcI_Luaii41re9I_nbw0WMXF9X48VgVnnOXyVCAlX7R5-rs2P3_N6UDSTiADezd4U_2uJfig12pAtKd70Jc57Mi4"
};

export const patient = {
  profile: {
    name: "Alex Rivers",
    patientId: "8291",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBuU8NQrE2v7rbiP4z5l_Y0IQcMrV_GMJ3W1DOwL4tM1AncIVwAPE7hD8ktiPF8kxHsforLqkX2FTDqJIDmBjc4YLnaf3dNE89KQAxMXSTe7ETS0tSqwX8sHRi570NZZ8b2EoE9ZVPGaeGqn4KMV2uXlQbHaDjLtfUdAaTIkO45hoOdD1c6r3NeeJXoLIlEdpYgyHassFdBhM-1g0APOx1QVLnI17HRE86WvkKJyafkGb-lGtegCu1dwOLssWAxk8Md7r3Wed_ubaLI"
  },
  vaccination: {
    product: "COVID-19 Vaccination (mRNA-1273)",
    percentComplete: 65,
    doses: [
      { label: "1st Dose", status: "Completed", date: "Oct 12, 2023", state: "done" },
      { label: "2nd Dose", status: "Scheduled", date: "Nov 09, 2023", state: "scheduled" },
      { label: "Booster", status: "Pending", date: "Est. Apr 2024", state: "pending" }
    ]
  },
  upcomingAppointment: {
    month: "Nov",
    day: "09",
    hospital: "Central City Hospital",
    time: "09:30 AM - Suite 402",
    locationTitle: "Main Medical Plaza",
    address: "122 Health Blvd, Central District"
  },
  insights: [
    {
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAvgaYBugTNEUtmNZX_v6WDlODlD9zmVZ2HuzgD3ZIyINbdJV0WDm7P3Zm0aekIUPZmvhZCvQCvmdVnD7TZWbEwSc9sES_muIwb-9DDu0ckPg1nqWXsUQOS_H6cgs63FBTPfauHbZjf6Tcf8nTgLyO4MVPWeuHfe273K5Q0O1STsVa3PGJRzGbx00KFIZJ4rruo9cvh-j2-7oIRaZCGSs9EY6-ZCP0HF6P5n2c4br61ojmZ5UrhvoiHrLtzVHzN613u8q-hTJCXFE66",
      title: "Understanding Immunity Windows",
      body: "New research suggests the second dose efficacy peaks at 14 days post-injection."
    },
    {
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCxH4pv-DajF80zJBlbhwjdy_RN49FugbhSipTtiDM0yRLO0JzxtarwCzkqV-qg_fkdq3KyJW7TbXidAu-azhD0JaG3hiCkB-taC1fa_EVgJrVHYJZnZlPsaThTJwAO43xTMrT3VGI2ouzNGTK4BtjXObjklu_0kA1caMp3A0HCRzHuoIRmpmztIL4UxJ0IwGId7jYPrw5RQ4W5O7F30eDC0NtvVEyu96WP9W-QPj25IqPyAD8G4tKNYUZfRv09fIUYYMhj3X4B9-A5",
      title: "New Facility Opening",
      body: "The South District Vaccination Hub is now accepting walk-ins for booster doses."
    }
  ],
  directorQuote: {
    quote: '"Precise care is the foundation of community resilience."',
    title: "Director's Note",
    body: "A message from Dr. Sarah Chen on the future of VacQ technology."
  },
  hospitalDirectory: {
    certifiedCenters: 42
  }
};

export const hospitalDetail = {
  name: "Saint Luke's",
  nameAccent: "Medical Center",
  tags: ["High Capacity", "COVID-19 Specialist", "Emergency 24/7"],
  description:
    "Recognized as one of the leading healthcare institutions globally, Saint Luke's provides world-class vaccination protocols within a sterile, state-of-the-art clinical environment. Our specialized immunology department ensures precise administration and follow-up care for all patients.",
  address: {
    lines: ["279 Rizal Ave, Extension,", "Metro Manila, Philippines"]
  },
  contact: {
    phone: "+63 (2) 8789-7700",
    email: "support@stluke.med"
  },
  heroImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDmMNg-AZz6DhcLisC0qC0yM6x1W4A2PuMe_GYeNRG-iIXSFQv_2vLIA1m6OLV87V2XkOd1MLodkPE-dlnMjh5pQDwFHtTnvjZVzDvIUPztJ_B-hGrN6PGVtI1qWDEAxNywaQk1L6ivXRX7ThpV3Il9Pg48X6IXskbLwOElXBtnX6DrrRlSV5dkJN05BnhgjlSxcEy6i6C_xpmchqxVkCkWw6TTTW69PCQW_QieOEkhHKJq9x6ofUyzBgaT2z4utxZNSO8hWPlTD8JR",
  mapImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAsEquI7vJUWBzSesBDG0PfDR53RvkTf_O7cgAhzRP17loYhTwgKaurxDkP0RrlW1PiSyuKSHu09Plpwe_B2XE_gDB-YnUQOI5DifAJZXhawO979Su2aaBAT4Ox0sx67sUNJUsojVscNmqop3Mvk4Kd-gC6gL0lKgVo8tX153hGGOJDFheGrIcgqfkzjh03lrD_oZ_X5uEQdYJu_pzs6h5KzL8Od9gfcioZyAgX21C7Q4UzH2VUiIXx67JbEVJAvPVz5Se51G6NWzwm",
  aboutBullets: [
    "Ultra-low temperature storage for sensitive mRNA vaccines",
    "Digital-first check-in with QR code validation",
    "Private recovery suites for post-administration observation"
  ],
  aboutParagraph:
    "Saint Luke's Medical Center operates as a non-profit foundation, reinvesting clinical revenues into advanced medical research and patient care facilities. Our vaccination wing is separated from general medicine to prioritize safety and speed.",
  clinicalAttention:
    "Please arrive at least 15 minutes before your scheduled slot. Bring a valid government ID and your digital VacQ reservation code.",
  appointmentSlotsUsed: 1,
  appointmentSlotsMax: 3
};

export const appointments = {
  notice: "You can hold up to 3 appointments.",
  upcoming: [
    {
      id: "1",
      hospital: "St. Mary's General Hospital",
      datetime: "October 24, 2023 • 09:30 AM",
      status: "Confirmed",
      statusStyle: "confirmed",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBKgIH-F9PVnenvXF3TCPzJZqbMRj9LnYtQdWmNaE1LVAlHiKA0jIKzs6TlRL2JwqsYTccz5UvXdVX75HtSx8hezCTLWjEVlVcEsxDLqJTx01w7V9B5tfTHES0GK24SDpAlXTLi8W9WIvvNVWLO4-aUPurwJGZh8U2xYzUk3r-M5I_hpSvdrChLW5cgaJWnKazzlMudLJ8P_1ZJ3mAsn1vMltY1jwGa_T7yY_6i3CE9nQ333ySZCZNfF1nIvxuuAS7CFcFpZ21fTc4r"
    },
    {
      id: "2",
      hospital: "Central Wellness Center",
      datetime: "November 12, 2023 • 14:15 PM",
      status: "In Review",
      statusStyle: "review",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB3nSmx0u5Fp10MNqCJewXoxTQT41AH0cMaKaJOg5MMBrE_F_76UO4g2FctRnhq-hEFDSzcq5pvoJPti8ZY1lp55Vk4pi4_91aHuHXutRAZEICddrn6_oNu8rLF-3ADeONY1LvxZfVtqfneBePXwv_jTXuSUp4NhhpF8Czu8PASJH-RKRp0qpbL1NhlC4n4geGIsAF7HJNfLgllPjzEFteUCBCWyhB0437ksxjAt92TLCS_ixGvNyY5A8sLebTN4Gh_Es_p2jhixSpO"
    }
  ],
  history: [
    { facility: "City Medical Complex", date: "August 15, 2023", outcome: "Completed", outcomeType: "completed" },
    { facility: "North Point Clinic", date: "July 02, 2023", outcome: "Completed", outcomeType: "completed" },
    { facility: "East Bay Vaccination Hub", date: "June 18, 2023", outcome: "Canceled", outcomeType: "canceled" }
  ],
  protection: {
    title: "High Efficiency",
    body: "Your vaccination sequence is 85% complete. Attend your next visit to reach optimal immunization status."
  }
};

export const vaccinationRecords = {
  passport: {
    label: "EU Digital COVID Certificate",
    qrImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAnbokjpABDv_KoOdKMfFdNCuFoWlZdz2VnhonYvFzynxRWs9PCg1Rt1vnXsrKVi2Frj4B_ybeQ9lz0xUq1ROljj7OitwbrzjHhfKYmVQdYgbcsiexJ7MSrPlXTo4TSWrXJoGl6aeT8PmZXMPqxoesZZ5BGkrWqFugQO_poXWLf5fcGJG9WXWZ9or48jy7-kFaMn8BcyOuL6FVUDz2TRUI2bUZOG7Uo4Uo296PSF2D2QmOOxGBxp7z9Sk-wdoRnITQP_41SfuYTqifJ",
    name: "Adrian Sterling",
    meta: "DOB: 12 May 1988 • ID: **** 9283",
    status: "Fully Vaccinated"
  },
  doses: [
    {
      title: "Dose 3: Pfizer-BioNTech",
      tag: "Booster",
      date: "October 15, 2023",
      location: "St. Mary's General Hospital • London, UK",
      batch: "FK9201-B",
      validatedBy: "Dr. Sarah Jenkins",
      iconActive: true
    },
    {
      title: "Dose 2: Pfizer-BioNTech",
      tag: null,
      date: "August 10, 2021",
      location: "Community Vaccination Hub • Bristol, UK",
      batch: "EP2045-A",
      validatedBy: "NHS Clinical Portal",
      iconActive: false
    },
    {
      title: "Dose 1: Pfizer-BioNTech",
      tag: null,
      date: "June 20, 2021",
      location: "Community Vaccination Hub • Bristol, UK",
      batch: "ER1922-Z",
      validatedBy: "NHS Clinical Portal",
      iconActive: false
    }
  ],
  recommendation: {
    title: "Clinical Recommendation",
    body: "Your next recommended influenza vaccination is due in November 2024. Schedule your appointment early to ensure availability."
  }
};

export const adminDashboard = {
  stats: {
    totalAdministrations: "1.28M+",
    totalTrend: "12.5% increase from last period",
    activeClinicNodes: "412",
    avgQueueWait: "14",
    avgQueueUnit: "min"
  },
  mapImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC6Nrb8-wjd-5m5F0QSyaL7Ih_8EFhqtPHWHeu1bVvpkmoZ_2zUc8e_f8mPgaidrR-RYhlnjrpAWo-D7tsD_w5hrd2jKtj1lBhd3MxShKwKXdHBziqWrNp59YQ6jg-krLlpOlTx0xriW-z0enqs1pdUrSnxnDhdJ_ZviZ8NtAukCUJyIpsw-4CrQj0NoS5davcU1HlESjBoPY0G2zIzglFC6f_bVkOjmYj8YiRht1rHUzYJ046hxm63Qkt6YQVmGydQPJNgxB2vhcsl",
  liveFeed: "Sector 7: 102 doses administered last 5m",
  dailyGoal: {
    percent: "92%",
    remaining: "11,402 doses remaining to hit target milestone."
  },
  clinicNodes: [
    {
      name: "Metropolitan Central Hospital",
      zone: "Zone A-1 · Main Hub",
      icon: "domain",
      queue: "128 Patients",
      queueStyle: "secondary",
      efficiency: "98%",
      efficiencyWidth: 98,
      efficiencyBar: "tertiary",
      staff: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAhDMrzzRGfhgxeWNWnan_DNoVjY5AKgXtbgXDzY4p59Am7WLrsOoY_--KgArMjW6ec3o4KCENJQTs7uP_BlqRpO1lLzlgmDztFETvx9SQdDZHsC81GooyEiwqgx-hucpcI-YUhOrORMh5xl5EVV-W0uziuIkbH9KhQssg6jDcAPLFpBFCOxqTLrJeU3dnQ5AqSabrYtJvbSL6KZm8BlursYZ9bUxE7XfL4fz4sqH0mZal0K7W4gy1T2ZK-RvrBk2YnPLRCIEgRGUCQ",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBhGiFeCAgXOHnHzq5elWEdNYd7osI5oz-kY4D43U9dEm8j9QGvkMaVXJXKbo-SjivNVyHZDk6FfkPzf4b-UVs7EyrSxrDLi7CdIkQGAl3pSW53sPTHjAY0YvBeFo5-u4kIlrx0-rGJoFlrZCOHpP9Zhdyv0RPiVaNGxvTGkijLYtifjCcBvN7j6I7XWzOSRZs1f5smWHTRXMECX7WX-GNJRnPxJCIUwVCvx_4cTILrDqDrLYGAj2OWzlTlQAx3QX420CuUYIeem6gX"
      ],
      staffExtra: 14
    },
    {
      name: "North Community Center",
      zone: "Zone C-4 · Satellite",
      icon: "health_and_safety",
      queue: "42 Patients",
      queueStyle: "primary-fixed",
      efficiency: "84%",
      efficiencyWidth: 84,
      efficiencyBar: "primary",
      staff: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAjnYYR-rEf8G5djuxnS_3aURuL4Ifyh-EM7FRjHoVXGYQ33cKnLGFa6NXQyL_gJVao6NrfwwF-f8nqZ6h2C7wLnDkvT_d2dtBj3NVncPlH-BR89pR0ayfsNg83T83IuWZXOykO_gQAZSsZieUixJjr2Y8HFR1WVe-PgPNzv14HiSnRr1QOy9qQyyejLStLviVXCKVNxyUrwnC_KTpynlIl4Q1obQEROnlNr26eYsbtVhp8wLsnzEIqVM4fg1lP2KEAmHrXEyGVbJT8"
      ],
      staffExtra: 6
    }
  ],
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBOvnny4ScZoSvH_90gm_crQKFIVGSenkzEL8pHyx9LiRVgi9s9jzFfInH3QkW0YiQ3GzjKDN911ALX9HXll6Lp797Szp5Q34F8V_WVZQ87MB8EKxzNm-kFVB6X8l7G2S6q_J7sYFfzMvxxq6Gf5XlKyJB0tl6lGCzeD2ceqqfbGfKnd3N-7JDCOwTM0n8HttZyFGs_B0qL7qmBYphhKPiPhTx6OVg2IFC9xcjVMK46sk5ZNToe_gOy6fJ4Th2tUEhu2-BV8kCCS9BD"
};

export const adminRegistry = {
  stats: {
    totalRegistered: "1,248,392",
    totalTrend: "+12.5% from last month",
    fullyVaccinated: "842,019",
    fullyPercent: 67,
    awaitingDose2: "156,420",
    awaitingNote: "Due within the next 14 days"
  },
  patients: [
    {
      initials: "JS",
      initialsClass: "bg-blue-100 text-blue-700",
      name: "Jonathan Smith",
      meta: "54 years • Male",
      id: "VAC-8829-XQ",
      priority: "Priority P1",
      priorityClass: "bg-error/10 text-error",
      status: "Fully Vaccinated",
      statusClass: "bg-tertiary-container text-on-tertiary-container",
      statusDot: "bg-on-tertiary-container"
    },
    {
      initials: "EL",
      initialsClass: "bg-amber-100 text-amber-700",
      name: "Elena Rodriguez",
      meta: "29 years • Female",
      id: "VAC-3104-PQ",
      priority: "Priority P3",
      priorityClass: "bg-sanctuary-secondary-container text-sanctuary-on-secondary-container",
      status: "Dose 1 Completed",
      statusClass: "bg-primary-fixed text-on-primary-fixed-variant",
      statusDot: "bg-primary animate-pulse"
    },
    {
      initials: "KC",
      initialsClass: "bg-emerald-100 text-emerald-700",
      name: "Kevin Chen",
      meta: "68 years • Male",
      id: "VAC-7721-LM",
      priority: "Priority P1",
      priorityClass: "bg-error/10 text-error",
      status: "Scheduled",
      statusClass: "bg-surface-container-highest text-on-surface-variant",
      statusDot: "bg-outline"
    },
    {
      initials: "SH",
      initialsClass: "bg-purple-100 text-purple-700",
      name: "Sarah Hughes",
      meta: "42 years • Female",
      id: "VAC-1192-ZZ",
      priority: "Priority P4",
      priorityClass: "bg-slate-200 text-slate-600",
      status: "Fully Vaccinated",
      statusClass: "bg-tertiary-container text-on-tertiary-container",
      statusDot: "bg-on-tertiary-container"
    },
    {
      initials: "AM",
      initialsClass: "bg-indigo-100 text-indigo-700",
      name: "Arjun Mehta",
      meta: "35 years • Male",
      id: "VAC-4456-WW",
      priority: "Priority P2",
      priorityClass: "bg-sanctuary-secondary-container text-sanctuary-on-secondary-container",
      status: "Dose 1 Completed",
      statusClass: "bg-primary-fixed text-on-primary-fixed-variant",
      statusDot: "bg-primary"
    }
  ],
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBwiR6z6xt6_AoWTQ0I9kqWWLERf0ZKPguHFGiSrcLtQtBMnmLvUdcp7YTUFuvWVtE2R5Q1NZTqMMXPuD-urRo6glul-_MAWwOEx_JL3GpVSzk1Dl1wg57zBzCV0ZW_z81CD2TlMPZ_jz14dfrIxIXbZUycdjPfMZwiTHXF2hZ_5ihiJ3fbV9gmtBp9RVVijk4jOg473udjUC3HQt23OzDx-8pb1pfrrxQkBHkjPkWIG6fcBUSI0EItWmFgp-1mliqhYAPMUlKRRZoh"
};

/** Shared admin UI identity (header / sidebar). */
export const admin = {
  profile: {
    name: "Dr. Sarah Chen",
    role: "Central Administrator",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwiR6z6xt6_AoWTQ0I9kqWWLERf0ZKPguHFGiSrcLtQtBMnmLvUdcp7YTUFuvWVtE2R5Q1NZTqMMXPuD-urRo6glul-_MAWwOEx_JL3GpVSzk1Dl1wg57zBzCV0ZW_z81CD2TlMPZ_jz14dfrIxIXbZUycdjPfMZwiTHXF2hZ_5ihiJ3fbV9gmtBp9RVVijk4jOg473udjUC3HQt23OzDx-8pb1pfrrxQkBHkjPkWIG6fcBUSI0EItWmFgp-1mliqhYAPMUlKRRZoh"
  }
};
