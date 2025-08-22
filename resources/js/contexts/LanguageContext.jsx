import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

// Translation files
const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      stores: 'Stores',
      freelancers: 'Freelancers',
      services: 'Services',
      categories: 'Categories',
      about: 'About',
      contact: 'Contact',
      signin: 'Sign In',
      listBusiness: 'List Your Business',
      becomeFreelancer: 'Become Freelancer',
      dashboard: 'Dashboard',
      myStores: 'My Stores',
      analytics: 'Analytics',
      storeManagement: 'Store Management',
      logout: 'Logout'
    },

    // Home Page
    home: {
      title: 'Discover Amazing Local Businesses in Jordan',
      subtitle: 'Find the best restaurants, cafes, shops, and services near you. Explore verified businesses with real customer reviews and detailed information.',
      startExploring: 'Start Exploring',
      listYourBusiness: 'List Your Business',
      popularCategories: 'Popular Categories',
      searchPlaceholder: 'Search for businesses, services, or products...',
      locationPlaceholder: 'Enter city or area...',
      searchButton: 'Search',
      featuredStores: 'Featured Stores',
      viewAllStores: 'View All Stores',
      noStoresFound: 'No stores found',
      noStoresMessage: 'Try adjusting your search or browse all categories.',
      verifiedBusiness: 'Verified Businesses',
      happyCustomers: 'Happy Customers',
      citiesCovered: 'Cities Covered',
      dailyUpdates: 'Daily Updates',
      filterByCategory: 'Filter by Category',
      filterByCity: 'Filter by City',
      showVerifiedOnly: 'Show Verified Only',
      resetFilters: 'Reset Filters',
      gridView: 'Grid View',
      mapView: 'Map View'
    },

    // Store Details
    store: {
      verified: 'Verified',
      pending: 'Pending Verification',
      open: 'Open',
      closed: 'Closed',
      about: 'About',
      contactInfo: 'Contact Information',
      location: 'Location',
      operatingHours: 'Operating Hours',
      photos: 'Photos',
      overview: 'Overview',
      hours: 'Hours',
      exterior: 'Exterior',
      interior: 'Interior',
      noPhotos: 'No photos available',
      getDirections: 'Get Directions',
      callNow: 'Call Now',
      visitWebsite: 'Visit Website',
      shareStore: 'Share Store',
      addToFavorites: 'Add to Favorites',
      today: 'Today'
    },

    // Categories
    categories: {
      restaurant: 'Restaurant',
      cafe: 'Cafe',
      shop: 'Shop',
      service: 'Service',
      healthcare: 'Healthcare',
      automotive: 'Automotive',
      beautyWellness: 'Beauty & Wellness',
      education: 'Education',
      other: 'Other'
    },

    // Days of Week
    days: {
      sunday: 'Sunday',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday'
    },

    // Authentication
    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone Number',
      loginButton: 'Sign In',
      registerButton: 'Create Account',
      forgotPassword: 'Forgot Password?',
      loginSuccess: 'Login successful!',
      loginFailed: 'Login failed',
      registrationSuccess: 'Registration successful! You can now log in with your account.',
      rememberMe: 'Remember me',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?'
    },

    // Dashboard
    dashboard: {
      welcome: 'Welcome back',
      subtitle: "Here's what's happening with your stores today.",
      totalStores: 'Total Stores',
      totalViews: 'Total Views',
      avgVisitDuration: 'Avg. Visit Duration',
      monthlyGrowth: 'Monthly Growth',
      quickActions: 'Quick Actions',
      addNewStore: 'Add New Store',
      registerBusiness: 'Register your business',
      viewAnalytics: 'View Analytics',
      checkPerformance: 'Check your performance',
      manageStores: 'Manage Stores',
      editListings: 'Edit your listings',
      yourStores: 'Your Stores',
      viewAll: 'View all',
      noStores: 'No stores yet',
      noStoresMessage: 'Get started by creating your first store.',
      addFirstStore: 'Add Your First Store'
    },

    // Store Form
    storeForm: {
      editStore: 'Edit Store',
      addNewStore: 'Add New Store',
      updateInfo: 'Update your store information',
      registerBusiness: 'Register your business with Store Viewer Jordan',
      storeVerified: 'Store Verified',
      verifiedMessage: 'Your store has been approved and is visible to customers.',
      pendingVerification: 'Pending Verification',
      pendingMessage: 'Your store is under admin review. You can still edit your information while waiting for approval.',
      adminNotes: 'Admin notes',
      basicInfo: 'Basic Information',
      storeName: 'Store Name',
      category: 'Category',
      subcategory: 'Subcategory',
      description: 'Description',
      businessLicenses: 'Business Licenses',
      nationalId: 'National ID',
      tradingLicense: 'Trading License Number',
      commercialReg: 'Commercial Registration',
      taxNumber: 'Tax Number',
      municipalityLicense: 'Municipality License',
      healthPermit: 'Health Permit',
      fireSafety: 'Fire Safety Certificate',
      contactInfo: 'Contact Information',
      website: 'Website',
      establishedDate: 'Established Date',
      socialMedia: 'Social Media',
      facebook: 'Facebook',
      instagram: 'Instagram',
      twitter: 'Twitter',
      locationHours: 'Location & Operating Hours',
      storeLocation: 'Store Location',
      operatingHours: 'Operating Hours',
      photos: 'Store Photos',
      exteriorPhotos: 'Exterior Photos',
      interiorPhotos: 'Interior Photos',
      dragDropImages: 'Drag & drop images here, or click to select',
      supportedFormats: 'Supported formats: JPEG, PNG, GIF (max 5MB each)',
      cancel: 'Cancel',
      save: 'Save',
      saving: 'Saving...',
      createStore: 'Create Store',
      updateStore: 'Update Store'
    },

    // Store List
    storeList: {
      myStores: 'My Stores',
      manageListings: 'Manage your store listings',
      allStores: 'All Stores',
      verified: 'Verified',
      pending: 'Pending',
      created: 'Created',
      edit: 'Edit',
      gallery: 'Gallery',
      menu: 'Menu',
      view: 'View',
      quickApprove: 'Quick Approve',
      reject: 'Reject',
      pendingApproval: 'Your store is pending admin approval',
      adminStoreManagement: 'Admin Store Management',
      pendingVerification: 'Pending Verification'
    },

    // Public Store Registration
    publicRegistration: {
      title: 'Register Your Store',
      subtitle: 'Join Al Amaken and get discovered by customers across Jordan',
      step: 'Step',
      of: 'of',
      ownerInfo: 'Owner Information',
      ownerInfoDesc: "We'll create your account with this information",
      storeDetails: 'Store Details',
      storeDetailsDesc: 'Tell us about your business',
      locationHours: 'Location & Hours',
      locationHoursDesc: 'Help customers find you',
      photosFinal: 'Photos & Final',
      photosDesc: 'Add photos to showcase your business',
      readyToSubmit: 'Ready to Submit',
      reviewMessage: 'Your store registration will be reviewed by our team. We\'ll create your account and notify you via email once approved. You can then log in to manage your store listing.',
      previous: 'Previous',
      next: 'Next',
      submitRegistration: 'Submit Registration',
      submitting: 'Submitting...',
      required: 'Required',
      optional: 'Optional',
      selectCategory: 'Select a category',
      descriptionPlaceholder: 'Describe your business, what you offer, what makes you special...',
      phonePlaceholder: '+962791234567',
      websitePlaceholder: 'https://yourwebsite.com',
      registrationSuccess: 'Store registration submitted successfully! Please check your email for account details.'
    },

    // Admin
    admin: {
      storeManagement: 'Store Management',
      reviewApprove: 'Review and approve store registrations',
      pendingReview: 'Pending Review',
      allStores: 'All Stores',
      noStoresFound: 'No stores found',
      allReviewed: 'All stores have been reviewed.',
      noStoresMessage: 'There are no stores at the moment.',
      review: 'Review',
      quickApprove: 'Quick Approve',
      quickReject: 'Reject',
      reviewStore: 'Review Store',
      verificationNotes: 'Verification Notes',
      notesPlaceholder: 'Enter notes about your decision...',
      approve: 'Approve',
      reject: 'Reject',
      processing: 'Processing...',
      accessDenied: 'Access Denied',
      adminRequired: 'You need admin privileges to access this page.'
    },

    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      cancel: 'Cancel',
      close: 'Close',
      search: 'Search',
      filter: 'Filter',
      reset: 'Reset',
      apply: 'Apply',
      more: 'More',
      less: 'Less',
      showMore: 'Show More',
      showLess: 'Show Less',
      viewDetails: 'View Details',
      backToTop: 'Back to Top',
      noResults: 'No results found',
      tryAgain: 'Try Again',
      refresh: 'Refresh',
      copy: 'Copy',
      share: 'Share',
      print: 'Print',
      download: 'Download',
      upload: 'Upload',
      delete: 'Delete',
      edit: 'Edit',
      save: 'Save',
      submit: 'Submit',
      update: 'Update',
      create: 'Create',
      add: 'Add',
      remove: 'Remove'
    },

    // Freelancer Registration
    freelancerRegistration: {
      title: 'Become a Freelancer',
      subtitle: 'Join our community and start offering your services',
      loginRequired: 'Login Required',
      loginRequiredMessage: 'You need to be logged in to register as a freelancer.',
      goToLogin: 'Go to Login',
      checkingAuth: 'Checking authentication...',
      basicInformation: 'Basic Information',
      professionalTitle: 'Professional Title',
      professionalTitlePlaceholder: 'e.g., Full Stack Developer, Graphic Designer',
      bio: 'Bio',
      bioPlaceholder: 'Tell potential clients about yourself, your experience, and what makes you unique...',
      profileImage: 'Profile Image',
      profileImageDesc: 'Upload a professional profile photo',
      skillsExperience: 'Skills & Experience',
      experienceLevel: 'Experience Level',
      experienceOptions: {
        beginner: 'Beginner (0-2 years)',
        intermediate: 'Intermediate (2-5 years)',
        expert: 'Expert (5+ years)'
      },
      skills: 'Skills',
      skillsSelected: 'selected',
      selectCommonSkills: 'Select from common skills',
      languages: 'Languages',
      addLanguage: 'Add a language',
      portfolioImages: 'Portfolio Images',
      portfolioImagesDesc: 'Upload up to 10 images showcasing your work',
      locationPricing: 'Location & Pricing',
      city: 'City',
      selectCity: 'Select City',
      hourlyRate: 'Hourly Rate (JOD)',
      availabilityStatus: 'Availability Status',
      availabilityOptions: {
        available: 'Available',
        busy: 'Busy',
        unavailable: 'Unavailable'
      },
      previous: 'Previous',
      next: 'Next',
      createProfile: 'Create Profile',
      creating: 'Creating...',
      cancel: 'Cancel',
      step: 'Step',
      of: 'of'
    },

    // Footer
    footer: {
      description: 'Discover and connect with the best local businesses across Jordan. Your trusted directory for restaurants, cafes, shops, and services.',
      quickLinks: 'Quick Links',
      support: 'Support',
      helpCenter: 'Help Center',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      followUs: 'Follow Us',
      allRightsReserved: 'All rights reserved.'
    }
  },

  ar: {
    // Navigation
    nav: {
      home: 'الرئيسية',
      stores: 'المتاجر',
      freelancers: 'المستقلون',
      services: 'الخدمات',
      categories: 'الفئات',
      about: 'حولنا',
      contact: 'اتصل بنا',
      signin: 'تسجيل الدخول',
      listBusiness: 'اضف متجرك',
      becomeFreelancer: 'كن مستقلاً',
      dashboard: 'لوحة التحكم',
      myStores: 'متاجري',
      analytics: 'التحليلات',
      storeManagement: 'إدارة المتاجر',
      logout: 'تسجيل الخروج'
    },

    // Home Page
    home: {
      title: 'اكتشف أفضل المحلات التجارية في الأردن',
      subtitle: 'ابحث عن أفضل المطاعم والمقاهي والمتاجر والخدمات بالقرب منك. استكشف المحلات التجارية المعتمدة مع تقييمات العملاء الحقيقية والمعلومات التفصيلية.',
      startExploring: 'ابدأ الاستكشاف',
      listYourBusiness: 'اضف متجرك',
      popularCategories: 'الفئات الشائعة',
      searchPlaceholder: 'ابحث عن المحلات التجارية أو الخدمات أو المنتجات...',
      locationPlaceholder: 'أدخل المدينة أو المنطقة...',
      searchButton: 'بحث',
      featuredStores: 'المتاجر المميزة',
      viewAllStores: 'عرض كل المتاجر',
      noStoresFound: 'لم يتم العثور على متاجر',
      noStoresMessage: 'حاول تعديل بحثك أو تصفح جميع الفئات.',
      verifiedBusiness: 'المحلات المعتمدة',
      happyCustomers: 'العملاء السعداء',
      citiesCovered: 'المدن المغطاة',
      dailyUpdates: 'التحديثات اليومية',
      filterByCategory: 'تصفية بالفئة',
      filterByCity: 'تصفية بالمدينة',
      showVerifiedOnly: 'عرض المعتمد فقط',
      resetFilters: 'إعادة تعيين التصفيات',
      gridView: 'عرض الشبكة',
      mapView: 'عرض الخريطة'
    },

    // Store Details
    store: {
      verified: 'معتمد',
      pending: 'بانتظار التحقق',
      open: 'مفتوح',
      closed: 'مغلق',
      about: 'حول',
      contactInfo: 'معلومات الاتصال',
      location: 'الموقع',
      operatingHours: 'ساعات العمل',
      photos: 'الصور',
      overview: 'نظرة عامة',
      hours: 'الساعات',
      exterior: 'خارجي',
      interior: 'داخلي',
      noPhotos: 'لا توجد صور متاحة',
      getDirections: 'الحصول على الاتجاهات',
      callNow: 'اتصل الآن',
      visitWebsite: 'زيارة الموقع',
      shareStore: 'شارك المتجر',
      addToFavorites: 'إضافة للمفضلة',
      today: 'اليوم'
    },

    // Categories
    categories: {
      restaurant: 'مطعم',
      cafe: 'مقهى',
      shop: 'متجر',
      service: 'خدمة',
      healthcare: 'رعاية صحية',
      automotive: 'سيارات',
      beautyWellness: 'الجمال والعافية',
      education: 'تعليم',
      other: 'أخرى'
    },

    // Days of Week
    days: {
      sunday: 'الأحد',
      monday: 'الاثنين',
      tuesday: 'الثلاثاء',
      wednesday: 'الأربعاء',
      thursday: 'الخميس',
      friday: 'الجمعة',
      saturday: 'السبت'
    },

    // Authentication
    auth: {
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      email: 'عنوان البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      phone: 'رقم الهاتف',
      loginButton: 'دخول',
      registerButton: 'إنشاء حساب',
      forgotPassword: 'نسيت كلمة المرور؟',
      loginSuccess: 'تم تسجيل الدخول بنجاح!',
      loginFailed: 'فشل في تسجيل الدخول',
      registrationSuccess: 'تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول بحسابك.',
      rememberMe: 'تذكرني',
      noAccount: 'ليس لديك حساب؟',
      hasAccount: 'لديك حساب بالفعل؟'
    },

    // Dashboard
    dashboard: {
      welcome: 'مرحباً بعودتك',
      subtitle: 'إليك ما يحدث مع متاجرك اليوم.',
      totalStores: 'إجمالي المتاجر',
      totalViews: 'إجمالي المشاهدات',
      avgVisitDuration: 'متوسط مدة الزيارة',
      monthlyGrowth: 'النمو الشهري',
      quickActions: 'الإجراءات السريعة',
      addNewStore: 'إضافة متجر جديد',
      registerBusiness: 'سجل عملك التجاري',
      viewAnalytics: 'عرض التحليلات',
      checkPerformance: 'تحقق من أدائك',
      manageStores: 'إدارة المتاجر',
      editListings: 'تحرير قوائمك',
      yourStores: 'متاجرك',
      viewAll: 'عرض الكل',
      noStores: 'لا توجد متاجر بعد',
      noStoresMessage: 'ابدأ بإنشاء متجرك الأول.',
      addFirstStore: 'إضافة متجرك الأول'
    },

    // Store Form
    storeForm: {
      editStore: 'تحرير المتجر',
      addNewStore: 'إضافة متجر جديد',
      updateInfo: 'تحديث معلومات متجرك',
      registerBusiness: 'سجل عملك التجاري في دليل المتاجر الأردني',
      storeVerified: 'المتجر معتمد',
      verifiedMessage: 'تم الموافقة على متجرك وهو مرئي للعملاء.',
      pendingVerification: 'بانتظار التحقق',
      pendingMessage: 'متجرك قيد المراجعة الإدارية. يمكنك تحرير معلوماتك أثناء انتظار الموافقة.',
      adminNotes: 'ملاحظات الإدارة',
      basicInfo: 'المعلومات الأساسية',
      storeName: 'اسم المتجر',
      category: 'الفئة',
      subcategory: 'الفئة الفرعية',
      description: 'الوصف',
      businessLicenses: 'التراخيص التجارية',
      nationalId: 'الرقم الوطني',
      tradingLicense: 'رقم الترخيص التجاري',
      commercialReg: 'السجل التجاري',
      taxNumber: 'الرقم الضريبي',
      municipalityLicense: 'ترخيص البلدية',
      healthPermit: 'تصريح صحي',
      fireSafety: 'شهادة السلامة من الحريق',
      contactInfo: 'معلومات الاتصال',
      website: 'الموقع الإلكتروني',
      establishedDate: 'تاريخ التأسيس',
      socialMedia: 'وسائل التواصل الاجتماعي',
      facebook: 'فيسبوك',
      instagram: 'انستغرام',
      twitter: 'تويتر',
      locationHours: 'الموقع وساعات العمل',
      storeLocation: 'موقع المتجر',
      operatingHours: 'ساعات العمل',
      photos: 'صور المتجر',
      exteriorPhotos: 'الصور الخارجية',
      interiorPhotos: 'الصور الداخلية',
      dragDropImages: 'اسحب واترك الصور هنا، أو انقر للاختيار',
      supportedFormats: 'الصيغ المدعومة: JPEG، PNG، GIF (بحد أقصى 5 ميجابايت لكل صورة)',
      cancel: 'إلغاء',
      save: 'حفظ',
      saving: 'جاري الحفظ...',
      createStore: 'إنشاء المتجر',
      updateStore: 'تحديث المتجر'
    },

    // Store List
    storeList: {
      myStores: 'متاجري',
      manageListings: 'إدارة قوائم متاجرك',
      allStores: 'كل المتاجر',
      verified: 'معتمد',
      pending: 'معلق',
      created: 'تم الإنشاء',
      edit: 'تحرير',
      gallery: 'المعرض',
      menu: 'القائمة',
      view: 'عرض',
      quickApprove: 'موافقة سريعة',
      reject: 'رفض',
      pendingApproval: 'متجرك في انتظار موافقة الإدارة',
      adminStoreManagement: 'إدارة المتاجر - الإدارة',
      pendingVerification: 'بانتظار التحقق'
    },

    // Public Store Registration
    publicRegistration: {
      title: 'سجل متجرك',
      subtitle: 'انضم إلى أبجد أماكن واكتشف من قبل العملاء في جميع أنحاء الأردن',
      step: 'الخطوة',
      of: 'من',
      ownerInfo: 'معلومات المالك',
      ownerInfoDesc: 'سنقوم بإنشاء حسابك بهذه المعلومات',
      storeDetails: 'تفاصيل المتجر',
      storeDetailsDesc: 'أخبرنا عن عملك التجاري',
      locationHours: 'الموقع والساعات',
      locationHoursDesc: 'ساعد العملاء في العثور عليك',
      photosFinal: 'الصور والخطوة الأخيرة',
      photosDesc: 'أضف صوراً لعرض عملك التجاري',
      readyToSubmit: 'جاهز للإرسال',
      reviewMessage: 'ستتم مراجعة تسجيل متجرك من قبل فريقنا. سننشئ حسابك ونخطرك عبر البريد الإلكتروني بمجرد الموافقة. يمكنك بعد ذلك تسجيل الدخول لإدارة قائمة متجرك.',
      previous: 'السابق',
      next: 'التالي',
      submitRegistration: 'إرسال التسجيل',
      submitting: 'جاري الإرسال...',
      required: 'مطلوب',
      optional: 'اختياري',
      selectCategory: 'اختر فئة',
      descriptionPlaceholder: 'صف عملك التجاري، ما تقدمه، ما يجعلك مميزاً...',
      phonePlaceholder: '+962791234567',
      websitePlaceholder: 'https://yourwebsite.com',
      registrationSuccess: 'تم تقديم تسجيل المتجر بنجاح! يرجى التحقق من بريدك الإلكتروني للحصول على تفاصيل الحساب.'
    },

    // Admin
    admin: {
      storeManagement: 'إدارة المتاجر',
      reviewApprove: 'مراجعة والموافقة على تسجيلات المتاجر',
      pendingReview: 'قيد المراجعة',
      allStores: 'كل المتاجر',
      noStoresFound: 'لم يتم العثور على متاجر',
      allReviewed: 'تم مراجعة جميع المتاجر.',
      noStoresMessage: 'لا توجد متاجر في الوقت الحالي.',
      review: 'مراجعة',
      quickApprove: 'موافقة سريعة',
      quickReject: 'رفض',
      reviewStore: 'مراجعة المتجر',
      verificationNotes: 'ملاحظات التحقق',
      notesPlaceholder: 'أدخل ملاحظات حول قرارك...',
      approve: 'موافقة',
      reject: 'رفض',
      processing: 'جاري المعالجة...',
      accessDenied: 'تم رفض الوصول',
      adminRequired: 'تحتاج إلى امتيازات الإدارة للوصول إلى هذه الصفحة.'
    },

    // Common
    common: {
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجح',
      warning: 'تحذير',
      info: 'معلومات',
      yes: 'نعم',
      no: 'لا',
      ok: 'موافق',
      cancel: 'إلغاء',
      close: 'إغلاق',
      search: 'بحث',
      filter: 'تصفية',
      reset: 'إعادة تعيين',
      apply: 'تطبيق',
      more: 'المزيد',
      less: 'أقل',
      showMore: 'عرض المزيد',
      showLess: 'عرض أقل',
      viewDetails: 'عرض التفاصيل',
      backToTop: 'العودة للأعلى',
      noResults: 'لم يتم العثور على نتائج',
      tryAgain: 'حاول مرة أخرى',
      refresh: 'تحديث',
      copy: 'نسخ',
      share: 'شارك',
      print: 'طباعة',
      download: 'تحميل',
      upload: 'رفع',
      delete: 'حذف',
      edit: 'تحرير',
      save: 'حفظ',
      submit: 'إرسال',
      update: 'تحديث',
      create: 'إنشاء',
      add: 'إضافة',
      remove: 'إزالة'
    },

    // Freelancer Registration
    freelancerRegistration: {
      title: 'كن مستقلاً',
      subtitle: 'انضم إلى مجتمعنا وابدأ في تقديم خدماتك',
      loginRequired: 'تسجيل الدخول مطلوب',
      loginRequiredMessage: 'تحتاج إلى تسجيل الدخول أولاً لتتمكن من التسجيل كمستقل.',
      goToLogin: 'تسجيل الدخول',
      checkingAuth: 'جاري التحقق من الحساب...',
      basicInformation: 'المعلومات الأساسية',
      professionalTitle: 'المسمى المهني',
      professionalTitlePlaceholder: 'مثال: مطور ويب متكامل، مصمم جرافيك',
      bio: 'النبذة الشخصية',
      bioPlaceholder: 'أخبر العملاء المحتملين عن نفسك وخبرتك وما يجعلك مميزاً...',
      profileImage: 'الصورة الشخصية',
      profileImageDesc: 'ارفع صورة شخصية احترافية',
      skillsExperience: 'المهارات والخبرة',
      experienceLevel: 'مستوى الخبرة',
      experienceOptions: {
        beginner: 'مبتدئ (0-2 سنة)',
        intermediate: 'متوسط (2-5 سنوات)',
        expert: 'خبير (5+ سنوات)'
      },
      skills: 'المهارات',
      skillsSelected: 'محدد',
      selectCommonSkills: 'اختر من المهارات الشائعة',
      languages: 'اللغات',
      addLanguage: 'إضافة لغة',
      portfolioImages: 'صور المعرض',
      portfolioImagesDesc: 'ارفع حتى 10 صور تعرض أعمالك',
      locationPricing: 'الموقع والأسعار',
      city: 'المدينة',
      selectCity: 'اختر المدينة',
      hourlyRate: 'السعر بالساعة (دينار أردني)',
      availabilityStatus: 'حالة التوفر',
      availabilityOptions: {
        available: 'متوفر',
        busy: 'مشغول',
        unavailable: 'غير متوفر'
      },
      previous: 'السابق',
      next: 'التالي',
      createProfile: 'إنشاء الملف الشخصي',
      creating: 'جاري الإنشاء...',
      cancel: 'إلغاء',
      step: 'الخطوة',
      of: 'من'
    },

    // Footer
    footer: {
      description: 'اكتشف وتواصل مع أفضل المحلات التجارية المحلية في جميع أنحاء الأردن. دليلك الموثوق للمطاعم والمقاهي والمتاجر والخدمات.',
      quickLinks: 'روابط سريعة',
      support: 'الدعم',
      helpCenter: 'مركز المساعدة',
      privacyPolicy: 'سياسة الخصوصية',
      termsOfService: 'شروط الخدمة',
      followUs: 'تابعنا',
      allRightsReserved: 'جميع الحقوق محفوظة.'
    }
  }
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [direction, setDirection] = useState('ltr');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    changeLanguage(savedLanguage);
  }, []);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    setDirection(newLanguage === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('language', newLanguage);
    
    // Update document direction and language
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
  };

  const t = (key) => {
    const keys = key.split('.');
    let result = translations[language];
    
    for (const k of keys) {
      if (result && typeof result === 'object') {
        result = result[k];
      } else {
        // Fallback to English if translation not found
        result = translations.en;
        for (const fallbackKey of keys) {
          if (result && typeof result === 'object') {
            result = result[fallbackKey];
          } else {
            return key; // Return the key if not found
          }
        }
        break;
      }
    }
    
    return result || key;
  };

  const value = {
    language,
    direction,
    changeLanguage,
    t,
    isRTL: language === 'ar'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;