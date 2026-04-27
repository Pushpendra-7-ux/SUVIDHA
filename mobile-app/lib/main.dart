import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'config/theme.dart';
import 'config/routes.dart';
import 'config/localization/app_localizations.dart';
import 'providers/auth_provider.dart';
import 'providers/complaint_provider.dart';
import 'providers/language_provider.dart';
import 'providers/notification_provider.dart';
import 'services/local_storage_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Lock to portrait mode
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // Status bar style
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.dark,
  ));

  // Initialize Hive
  await LocalStorageService.init();

  // Firebase initialization (uncomment when google-services.json is added)
  // await Firebase.initializeApp();

  runApp(const UrbanApp());
}

class UrbanApp extends StatelessWidget {
  const UrbanApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => LanguageProvider()),
        ChangeNotifierProvider(create: (_) => ComplaintProvider()),
        ChangeNotifierProvider(create: (_) => NotificationProvider()),
      ],
      child: Consumer<LanguageProvider>(
        builder: (context, langProvider, _) {
          return MaterialApp.router(
            title: 'URBAN',
            debugShowCheckedModeBanner: false,
            theme: UrbanTheme.lightTheme,
            routerConfig: AppRoutes.router,
            locale: langProvider.locale,
            supportedLocales: const [
              Locale('en'),
              Locale('hi'),
              Locale('as'),
            ],
            localizationsDelegates: const [
              AppLocalizations.delegate,
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
            ],
          );
        },
      ),
    );
  }
}
