// Polish wording for the dashboard, keyed by the English text in the
// components. Entries are grouped by where they appear. Printed invoices and
// exported files stay in English and are not listed here.

import { PL_PAGES } from './pl-pages.ts';

export const PL_TEXT: Record<string, string> = {
  ...PL_PAGES,

  // Language setting
  Language: 'Język',
  Preferences: 'Preferencje',
  'Dashboard language': 'Język panelu',
  'English (default)': 'English (domyślny)',
  English: 'Angielski',
  Polski: 'Polski',
  'Menus, pages, buttons and messages change language for you only. Printed invoices always stay in English.':
    'Menu, strony, przyciski i komunikaty zmieniają język tylko dla Ciebie. Drukowane faktury zawsze pozostają po angielsku.',
  'Language changed': 'Zmieniono język',
  'The dashboard is now in English. Printed invoices stay in English.':
    'Panel jest teraz po angielsku. Drukowane faktury pozostają po angielsku.',
  'The dashboard is now in Polish. Printed invoices stay in English.':
    'Panel jest teraz po polsku. Drukowane faktury pozostają po angielsku.',
  'Could not save your language. Please try again.':
    'Nie udało się zapisać języka. Spróbuj ponownie.',
  'Choose a language.': 'Wybierz język.',
  'Choose English or Polish.': 'Wybierz angielski lub polski.',

  // Sidebar, top bar and navigation
  'Go to home': 'Przejdź do strony głównej',
  WORKSPACE: 'OBSZAR ROBOCZY',
  Workspace: 'Obszar roboczy',
  'Skip to content': 'Przejdź do treści',
  Home: 'Strona główna',
  'Load Desk': 'Load Desk',
  'Invoices & Tickets': 'Faktury i kwity',
  'Customers & Clients': 'Klienci i płatnicy',
  'Truck Fleet': 'Flota ciężarówek',
  Account: 'Konto',

  // Account menu
  'Local preview': 'Podgląd lokalny',
  'Loading account…': 'Wczytywanie konta…',
  'Account: {name}. Open account menu': 'Konto: {name}. Otwórz menu konta',
  'Unprotected local preview': 'Niezabezpieczony podgląd lokalny',
  'Signed in': 'Zalogowano',
  'Not signed in': 'Nie zalogowano',
  'This browser only': 'Tylko ta przeglądarka',
  Member: 'Członek',
  'Account profile': 'Profil konta',
  'Signing out…': 'Wylogowywanie…',
  'Sign out': 'Wyloguj się',
  'Sign in': 'Zaloguj się',

  // Login
  '← Back to Monius Systems': '← Wróć do Monius Systems',
  'Sign In to {workspace}': 'Zaloguj się do {workspace}',
  Email: 'E-mail',
  Password: 'Hasło',
  'Sign-in failed.': 'Logowanie nie powiodło się.',
  'Signing in…': 'Logowanie…',
  'Access is by invitation. Contact Monius Systems for an account or a password reset.':
    'Dostęp tylko na zaproszenie. Aby uzyskać konto lub zresetować hasło, skontaktuj się z Monius Systems.',
  'Checking sign-in…': 'Sprawdzanie logowania…',
  'This is an unprotected local preview. Data is saved in this browser only.':
    'To niezabezpieczony podgląd lokalny. Dane są zapisywane tylko w tej przeglądarce.',
  'Sign-in is not available right now. Please try again later or contact Monius Systems.':
    'Logowanie jest teraz niedostępne. Spróbuj ponownie później lub skontaktuj się z Monius Systems.',
  'Open the local preview': 'Otwórz podgląd lokalny',
  'Sign-in failed, or this account has not been given access to this workspace.':
    'Logowanie nie powiodło się albo to konto nie ma dostępu do tego obszaru roboczego.',
  'Enter your email and password.': 'Wpisz e-mail i hasło.',
  'Sign-in is unavailable right now. Please try again later.':
    'Logowanie jest teraz niedostępne. Spróbuj ponownie później.',

  // Account page
  ACCOUNT: 'KONTO',
  'Your account': 'Twoje konto',
  'Unprotected local preview. Nothing on this page leaves this browser.':
    'Niezabezpieczony podgląd lokalny. Nic z tej strony nie opuszcza tej przeglądarki.',
  'Signed in to {company} · {workspace}': 'Zalogowano do {company} · {workspace}',
  'Member since': 'Członek od',
  'Last sign-in': 'Ostatnie logowanie',
  'Loading your account…': 'Wczytywanie konta…',
  You: 'Ty',
  'Photo saved': 'Zdjęcie zapisane',
  'It shows in the sidebar and account menu.': 'Jest widoczne na pasku bocznym i w menu konta.',
  'Photo removed': 'Zdjęcie usunięte',
  'Your initials show instead.': 'Zamiast niego widać Twoje inicjały.',
  'missing information': 'brak informacji',
  'On another invoice': 'Na innej fakturze',
  'on another invoice': 'na innej fakturze',
  'Crop your photo': 'Przytnij zdjęcie',
  'Crop the logo': 'Przytnij logo',
  'Drag the picture to move it, and zoom until it sits the way you want.':
    'Przeciągnij obraz, aby go przesunąć, i przybliż, aż będzie leżał jak trzeba.',
  Zoom: 'Powiększenie',
  Reset: 'Przywróć',
  'That picture could not be read.': 'Nie udało się odczytać tego obrazu.',
  'This browser cannot prepare the picture.':
    'Ta przeglądarka nie może przygotować tego obrazu.',
  'Logo saved': 'Logo zapisane',
  'Logo removed': 'Logo usunięte',
  'The company initials show again.': 'Znów widać inicjały firmy.',
  'Add company logo': 'Dodaj logo firmy',
  'Change logo': 'Zmień logo',
  'Remove logo': 'Usuń logo',
  'Profile saved': 'Profil zapisany',
  'Saved in this browser for the local preview.':
    'Zapisano w tej przeglądarce na potrzeby podglądu lokalnego.',
  'Your name shows in the sidebar and account menu.':
    'Twoje imię i nazwisko jest widoczne na pasku bocznym i w menu konta.',
  Profile: 'Profil',
  'Your Details': 'Twoje dane',
  'No sign-in email in the local preview': 'Brak e-maila logowania w podglądzie lokalnym',
  'Saving…': 'Zapisywanie…',
  'Change photo': 'Zmień zdjęcie',
  'Add photo': 'Dodaj zdjęcie',
  Remove: 'Usuń',
  'Full name': 'Imię i nazwisko',
  'First and last name': 'Imię i nazwisko',
  Phone: 'Telefon',
  'Sign-in email': 'E-mail logowania',
  'Not used in the local preview': 'Nieużywany w podglądzie lokalnym',
  'Signed-in members see the email they use to sign in.':
    'Zalogowani członkowie widzą tu e-mail, którym się logują.',
  'To change the email you sign in with, contact Monius Systems.':
    'Aby zmienić e-mail logowania, skontaktuj się z Monius Systems.',
  'Save profile': 'Zapisz profil',
  'Enter the company name.': 'Wpisz nazwę firmy.',
  'Company name saved': 'Nazwa firmy zapisana',
  'It shows in the sidebar and menus for everyone in the workspace.':
    'Jest widoczna na pasku bocznym i w menu dla wszystkich w obszarze roboczym.',
  Access: 'Dostęp',
  'Edit name': 'Edytuj nazwę',
  'Company name': 'Nazwa firmy',
  Cancel: 'Anuluj',
  Save: 'Zapisz',
  Role: 'Rola',
  'Account created': 'Konto utworzone',
  'Company name and address': 'Nazwa i adres firmy',
  'Loading the company name and address…': 'Wczytywanie nazwy i adresu firmy…',
  'Enter the street address.': 'Wpisz ulicę i numer.',
  'Company name and address saved': 'Nazwa i adres firmy zapisane',
  'Every invoice you open or print now shows them.':
    'Każda otwierana lub drukowana faktura będzie je teraz zawierać.',
  Invoices: 'Faktury',
  'Company Name and Address': 'Nazwa i adres firmy',
  'Street address': 'Ulica i numer',
  'City, state and ZIP': 'Miasto, stan i kod pocztowy',
  'Printed at the top of every invoice, for everyone in the workspace.':
    'Drukowane u góry każdej faktury, dla wszystkich w obszarze roboczym.',
  'Save name and address': 'Zapisz nazwę i adres',
  'On the invoice': 'Na fakturze',
  'Street address placeholder': 'Ulica i numer',
  'Enter your current password.': 'Wpisz obecne hasło.',
  'Use at least {min} characters for the new password.':
    'Nowe hasło musi mieć co najmniej {min} znaków.',
  'Choose a new password that is different from the current one.':
    'Wybierz nowe hasło, inne niż obecne.',
  'The new passwords do not match.': 'Nowe hasła nie są takie same.',
  'Password changed': 'Hasło zmienione',
  'Use your new password the next time you sign in.':
    'Przy następnym logowaniu użyj nowego hasła.',
  'Sign-out failed': 'Wylogowanie nie powiodło się',
  Security: 'Bezpieczeństwo',
  'Password and Sign-In': 'Hasło i logowanie',
  'The local preview has no sign-in, so there is no password or session to manage. These controls work once you sign in with a workspace account.':
    'Podgląd lokalny nie ma logowania, więc nie ma hasła ani sesji do zarządzania. Te opcje działają po zalogowaniu się kontem obszaru roboczego.',
  'Change Password': 'Zmień hasło',
  'Current password': 'Obecne hasło',
  'New password': 'Nowe hasło',
  'Confirm new password': 'Potwierdź nowe hasło',
  'At least {min} characters': 'Co najmniej {min} znaków',
  'Different from the current one': 'Inne niż obecne',
  'Both entries match': 'Oba wpisy są takie same',
  'Changing…': 'Zmienianie…',
  'Change password': 'Zmień hasło',
  Sessions: 'Sesje',
  'This browser': 'Ta przeglądarka',
  'Sign out here. Other devices stay signed in.':
    'Wyloguj się tutaj. Inne urządzenia pozostaną zalogowane.',
  'All devices': 'Wszystkie urządzenia',
  'Use this if you signed in on a shared or lost device.':
    'Użyj tego, jeśli logowano się na wspólnym lub zgubionym urządzeniu.',
  'Sign out everywhere': 'Wyloguj się wszędzie',
  'Sign out on every device?': 'Wylogować się na wszystkich urządzeniach?',
  'Every browser and device signed in to this account, including this one, is signed out. You will need your password to sign in again.':
    'Wszystkie przeglądarki i urządzenia zalogowane na to konto, łącznie z tym, zostaną wylogowane. Do ponownego logowania potrzebne będzie hasło.',

  // Messages from the account and photo services
  'Choose an image file (JPG, PNG or WebP).': 'Wybierz plik obrazu (JPG, PNG lub WebP).',
  'Choose a photo under 20 MB.': 'Wybierz zdjęcie mniejsze niż 20 MB.',
  'Choose a logo under 20 MB.': 'Wybierz logo mniejsze niż 20 MB.',
  'Use a logo under 2 MB.': 'Użyj logo mniejszego niż 2 MB.',
  'Use a JPG, PNG or WebP image.': 'Użyj obrazu JPG, PNG lub WebP.',
  'Choose a logo.': 'Wybierz logo.',
  'That image could not be read.': 'Nie udało się odczytać tego obrazu.',
  'Could not save the logo. Please try again.':
    'Nie udało się zapisać logo. Spróbuj ponownie.',
  'Could not remove the logo. Please try again.':
    'Nie udało się usunąć logo. Spróbuj ponownie.',
  'That photo could not be read. Use a JPG, PNG or WebP image.':
    'Nie udało się odczytać zdjęcia. Użyj obrazu JPG, PNG lub WebP.',
  'That photo could not be read.': 'Nie udało się odczytać zdjęcia.',
  'This browser cannot prepare the photo.': 'Ta przeglądarka nie może przygotować zdjęcia.',
  'This browser is blocking storage, so the preview cannot save the photo.':
    'Ta przeglądarka blokuje pamięć, więc podgląd nie może zapisać zdjęcia.',
  'This browser is blocking storage, so the preview cannot change the photo.':
    'Ta przeglądarka blokuje pamięć, więc podgląd nie może zmienić zdjęcia.',
  'This browser is blocking storage, so the preview cannot save.':
    'Ta przeglądarka blokuje pamięć, więc podgląd nie może zapisać zmian.',
  'Use a photo under 2 MB.': 'Użyj zdjęcia mniejszego niż 2 MB.',
  'Use a JPG, PNG or WebP photo.': 'Użyj zdjęcia JPG, PNG lub WebP.',
  'Choose a photo.': 'Wybierz zdjęcie.',
  'Could not save your photo. Please try again.':
    'Nie udało się zapisać zdjęcia. Spróbuj ponownie.',
  'Could not remove your photo. Please try again.':
    'Nie udało się usunąć zdjęcia. Spróbuj ponownie.',
  'Could not save your profile. Please try again.':
    'Nie udało się zapisać profilu. Spróbuj ponownie.',
  'Send your name and phone number.': 'Wyślij imię i nazwisko oraz numer telefonu.',
  'Keep your name under 120 characters.': 'Imię i nazwisko może mieć najwyżej 120 znaków.',
  'Enter a phone number using digits, spaces, +, -, parentheses or ext.':
    'Wpisz numer telefonu, używając cyfr, spacji, +, -, nawiasów lub „wew.”.',
  'Could not reach the server. Check your connection and try again.':
    'Nie udało się połączyć z serwerem. Sprawdź połączenie i spróbuj ponownie.',
  'Something went wrong. Please try again.': 'Coś poszło nie tak. Spróbuj ponownie.',
  'Sign in with an authorized account.': 'Zaloguj się kontem z dostępem.',
  'Sign-in is unavailable right now.': 'Logowanie jest teraz niedostępne.',
  'Sign-in is unavailable.': 'Logowanie jest niedostępne.',
  'Your session has ended. Sign in again to save.':
    'Sesja wygasła. Zaloguj się ponownie, aby zapisać.',

  // Charts
  'Other customers': 'Pozostali klienci',
  'Loads by Customer': 'Ładunki według klientów',
  'by ticket date': 'według daty kwitu',
  'Up to your latest load': 'Do ostatniego ładunku',
  'Last 12 months': 'Ostatnie 12 miesięcy',
  'Loads by Month': 'Ładunki według miesięcy',
  Timeline: 'Okres',
  'Timeline for {name}': 'Okres dla: {name}',
  'Show loads': 'Pokaż ładunki',
  'By customer': 'Według klientów',
  'By month': 'Według miesięcy',
  'Loads by customer {period}': 'Ładunki według klientów {period}',
  'Loads for {name} {period}': 'Ładunki dla: {name} {period}',
  'Loads by month, {range}': 'Ładunki według miesięcy, {range}',
  '{count} load without a time is counted but not charted.':
    'Ładunki bez godziny ({count}) są liczone, ale nie ma ich na wykresie.',
  '{count} loads without a time are counted but not charted.':
    'Ładunki bez godziny ({count}) są liczone, ale nie ma ich na wykresie.',
  '{tons} Tons': '{tons} ton',
  '{tons} Tons · {billed} billed': '{tons} ton · zafakturowano {billed}',
  '{month}: {loads}, {tons} Tons, {billed} billed':
    '{month}: {loads}, {tons} ton, zafakturowano {billed}',
  When: 'Kiedy',
  Loads: 'Ładunki',
  Tons: 'Tony',
  Today: 'Dzisiaj',
  'This week': 'Ten tydzień',
  'This month': 'Ten miesiąc',
  'This year': 'Ten rok',
  Lifetime: 'Cały okres',
  today: 'dzisiaj',
  'this week': 'w tym tygodniu',
  'this month': 'w tym miesiącu',
  'this year': 'w tym roku',
  'in total': 'łącznie',

  // Month and day names (charts and dates)
  Jan: 'sty',
  Feb: 'lut',
  Mar: 'mar',
  Apr: 'kwi',
  May: 'maj',
  Jun: 'cze',
  Jul: 'lip',
  Aug: 'sie',
  Sep: 'wrz',
  Oct: 'paź',
  Nov: 'lis',
  Dec: 'gru',
  January: 'styczeń',
  February: 'luty',
  March: 'marzec',
  April: 'kwiecień',
  June: 'czerwiec',
  July: 'lipiec',
  August: 'sierpień',
  September: 'wrzesień',
  October: 'październik',
  November: 'listopad',
  December: 'grudzień',
  Mon: 'pon.',
  Tue: 'wt.',
  Wed: 'śr.',
  Thu: 'czw.',
  Fri: 'pt.',
  Sat: 'sob.',
  Sun: 'niedz.',
};

/** Polish noun forms for counts: [1, 2–4, 5+], keyed by the English singular. */
export const PL_NOUNS: Record<string, [string, string, string]> = {
  load: ['ładunek', 'ładunki', 'ładunków'],
  ticket: ['kwit', 'kwity', 'kwitów'],
  customer: ['klient', 'klienci', 'klientów'],
  client: ['płatnik', 'płatnicy', 'płatników'],
  'truck number': ['numer ciężarówki', 'numery ciężarówek', 'numerów ciężarówek'],
  'ticket name': ['nazwa z kwitu', 'nazwy z kwitów', 'nazw z kwitów'],
  site: ['miejsce', 'miejsca', 'miejsc'],
  'saved ticket': ['zapisany kwit', 'zapisane kwity', 'zapisanych kwitów'],
  invoice: ['faktura', 'faktury', 'faktur'],
  truck: ['ciężarówka', 'ciężarówki', 'ciężarówek'],
  file: ['plik', 'pliki', 'plików'],
  item: ['pozycja', 'pozycje', 'pozycji'],
  draft: ['szkic', 'szkice', 'szkiców'],
  day: ['dzień', 'dni', 'dni'],
  character: ['znak', 'znaki', 'znaków'],
};

const MONTH_SHORT = 'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec';
const MONTH_FULL =
  'January|February|March|April|May|June|July|August|September|October|November|December';
const DAY_SHORT = 'Mon|Tue|Wed|Thu|Fri|Sat|Sun';

/** "1 PM" → "13:00". */
const clock = (hour: string, half: string) => {
  const value = Number(hour) % 12 + (half === 'PM' ? 12 : 0);
  return `${value}:00`;
};

/**
 * Messages built from parts (for example chart labels such as "Sep 4" or
 * "1 PM – 2 PM"). Each pattern matches the English text; `inner` translates a
 * captured English word through the dictionary.
 */
export const PL_PATTERNS: [
  RegExp,
  (match: RegExpExecArray, inner: (text: string) => string) => string,
][] = [
  [/^(\d{1,2}) (AM|PM) – (\d{1,2}) (AM|PM)$/, (m) => `${clock(m[1], m[2])}–${clock(m[3], m[4])}`],
  [/^(\d{1,2}) (AM|PM)$/, (m) => clock(m[1], m[2])],
  [new RegExp(`^(${DAY_SHORT}), (${MONTH_SHORT}) (\\d{1,2})$`), (m, inner) => `${inner(m[1])}, ${m[3]} ${inner(m[2])}`],
  [new RegExp(`^(${MONTH_SHORT}) (\\d{1,2}), (\\d{4})$`), (m, inner) => `${m[2]} ${inner(m[1])} ${m[3]}`],
  [new RegExp(`^(${MONTH_SHORT}) (\\d{1,2})$`), (m, inner) => `${m[2]} ${inner(m[1])}`],
  [new RegExp(`^(${MONTH_SHORT}) ['’](\\d{2})$`), (m, inner) => `${inner(m[1])} ’${m[2]}`],
  [new RegExp(`^(${MONTH_SHORT}) (\\d{4}) – (${MONTH_SHORT}) (\\d{4})$`), (m, inner) => `${inner(m[1])} ${m[2]} – ${inner(m[3])} ${m[4]}`],
  [new RegExp(`^(${MONTH_FULL}) (\\d{4})$`), (m, inner) => `${inner(m[1])} ${m[2]}`],
  // Extraction progress on a multi-page file
  [/^(.+) · page (\d+) of (\d+)$/, (m, inner) => `${inner(m[1])} · strona ${m[2]} z ${m[3]}`],
  // Ticket checks
  [/^Missing required field: (.+)$/, (m, inner) => `Brak wymaganego pola: ${inner(m[1])}`],
  [/^Weight arithmetic differs by (.+) lb$/, (m) => `Wagi różnią się o ${m[1]} lb`],
  [
    /^Not read from the scan: (.+)\. Enter it from the original\.$/,
    (m, inner) => `Nie odczytano ze skanu: ${inner(m[1])}. Wpisz z oryginału.`,
  ],
  // Line totals such as "12.50 Tons × $8.00 + $20.00 fuel = $120.00"
  [
    / = \S+$/,
    (m) =>
      m.input
        .replace(' per load', ' za ładunek')
        .replace(' Tons ×', ' t ×')
        .replace(/ fuel\b/g, ' za paliwo'),
  ],
];
