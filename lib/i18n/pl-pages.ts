// Polish wording for the workspace pages (Home, Load Desk, Invoices & Tickets,
// Customers & Clients, Truck Fleet), keyed by the English text. Wording shared
// with the shell and account pages lives in pl.ts.

export const PL_PAGES: Record<string, string> = {
  // Shown until a workspace saves its own company name on the Account page.
  'Your company': 'Twoja firma',
  'your company': 'Twojej firmy',
  // Empty-field hints: these describe the field rather than showing an example,
  // so no company's real details are suggested to another company.
  'Your company name, as it should print': 'Nazwa firmy, tak jak ma być drukowana',
  'Number and street': 'Numer i ulica',
  'Number as printed on the ticket': 'Numer tak jak na kwicie',
  'What the crew calls it': 'Jak nazywa go załoga',
  // Shared across pages
  Customers: 'Klienci',
  Customer: 'Klient',
  'Customer name': 'Nazwa klienta',
  Clients: 'Płatnicy',
  Client: 'Płatnik',
  'Bill to': 'Płatnik',
  Trucks: 'Ciężarówki',
  Truck: 'Ciężarówka',
  'Truck #': 'Nr ciężarówki',
  'Truck #{number}': 'Ciężarówka nr {number}',
  Driver: 'Kierowca',
  Fleet: 'Flota',
  Active: 'W użyciu',
  Inactive: 'Nieaktywna',
  Tickets: 'Kwity',
  Ticket: 'Kwit',
  Invoice: 'Faktura',
  'Invoice {number}': 'Faktura {number}',
  'Invoice #': 'Nr faktury',
  'Invoice date': 'Data faktury',
  'Invoice number': 'Numer faktury',
  Draft: 'Szkic',
  Drafts: 'Szkice',
  Rated: 'Ze stawką',
  Valid: 'Poprawny',
  'Needs review': 'Do sprawdzenia',
  'To confirm': 'Do potwierdzenia',
  Status: 'Status',
  'Net tons': 'Tony netto',
  'Line total': 'Wartość pozycji',
  Total: 'Razem',
  Billed: 'Zafakturowano',
  'Last load': 'Ostatni ładunek',
  'Loads this month': 'Ładunki w tym miesiącu',
  'Without a profile': 'Bez profilu',
  Actions: 'Akcje',
  Edit: 'Edytuj',
  Delete: 'Usuń',
  View: 'Pokaż',
  Original: 'Oryginał',
  Notes: 'Notatki',
  None: 'Brak',
  Add: 'Dodaj',
  Close: 'Zamknij',
  Selected: 'Wybrany',
  'Edit profile': 'Edytuj profil',
  'Phone number': 'Numer telefonu',

  // Customer and client dialogs
  Company: 'Firma',
  'Address and phone': 'Adres i telefon',
  'Matching tickets': 'Dopasowanie kwitów',
  'No printed names yet.': 'Brak nazw z kwitów.',
  'Add a name printed on tickets': 'Dodaj nazwę drukowaną na kwitach',
  'Name as printed on the ticket': 'Nazwa tak, jak na kwicie',
  'Customer number': 'Numer klienta',

  // The default client and what Load Desk is doing elsewhere
  'Default bill-to client': 'Domyślny płatnik faktur',
  'No default client': 'Bez domyślnego płatnika',
  'New invoices start billed to this client. You can change it on any invoice.':
    'Nowe faktury są domyślnie wystawiane na tego płatnika. Możesz to zmienić na każdej fakturze.',
  'Default client saved': 'Zapisano domyślnego płatnika',
  'New invoices start billed to {name}.': 'Nowe faktury będą wystawiane na: {name}.',
  'New invoices start with no client.': 'Nowe faktury będą bez płatnika.',
  'Could not save the default client. Please try again.':
    'Nie udało się zapisać domyślnego płatnika. Spróbuj ponownie.',
  'Scan ticket': 'Skanuj kwit',
  'Tickets are ready for review': 'Kwity są gotowe do sprawdzenia',
  '{tickets} waiting in Load Desk.': 'W Load Desk czeka: {tickets}.',
  'A ticket matches when its customer name contains one of these or the profile name. A name a letter or two off still matches, so a printer dropping or adding a character is fine.':
    'Kwit pasuje, gdy nazwa klienta zawiera jedną z nich lub nazwę profilu. Nazwa różniąca się o literę lub dwie też pasuje, więc pominięty lub dodany znak nie przeszkadza.',

  // A printed name that is slightly off the customer's spelling
  'The ticket prints “{printed}”, a letter or two off {name}.':
    'Na kwicie widnieje „{printed}”, o literę lub dwie inaczej niż {name}.',
  'Remember this spelling': 'Zapamiętaj tę pisownię',
  'Spelling remembered': 'Zapamiętano pisownię',
  'Tickets printed “{printed}” now match {name} exactly.':
    'Kwity z nazwą „{printed}” pasują teraz dokładnie do: {name}.',
  'Could not save the spelling': 'Nie udało się zapisać pisowni',
  Open: 'Otwórz',
  Review: 'Sprawdź',
  'Save changes': 'Zapisz zmiany',
  'Delete failed': 'Nie udało się usunąć',
  'Updated {name}': 'Zaktualizowano: {name}',
  'Added {name}': 'Dodano: {name}',
  'Deleted {name}': 'Usunięto: {name}',
  'Tel: {phone}': 'Tel.: {phone}',
  'Plate {plate}': 'Tablica {plate}',
  'Upload tickets': 'Prześlij kwity',
  'Original unavailable': 'Oryginał niedostępny',
  unnumbered: 'bez numeru',
  Unnumbered: 'Bez numeru',
  'No customer': 'Brak klienta',
  'Deleted ticket {number}': 'Usunięto kwit {number}',
  'Its line was removed from invoice {number}, and the stored original was deleted.':
    'Jego pozycję usunięto z faktury {number}, a zapisany oryginał skasowano.',
  'Delete ticket {number}?': 'Usunąć kwit {number}?',
  'Delete ticket': 'Usuń kwit',
  'Fuel charge type': 'Rodzaj dopłaty paliwowej',
  'Fuel charge (% of rate)': 'Dopłata paliwowa (% stawki)',
  'Fuel charge %': 'Dopłata paliwowa %',
  'Rate type': 'Rodzaj stawki',
  // Rates at particular job sites, for a customer hauled to several at
  // different prices.
  'Job sites & rates': 'Miejsca dostaw i stawki',
  'Delivery addresses, each with what is charged there':
    'Adresy dostaw, każdy ze stawką, jaka tam obowiązuje',
  'Rate at {address}': 'Stawka w {address}',
  'Charge': 'Opłata',
  'Fuel only': 'Tylko paliwo',
  'each with its own rate': 'każde z własną stawką',
  'Tickets to {sites} get that site’s rate on the invoice.':
    'Kwity do {sites} dostają na fakturze stawkę tego miejsca.',
  'Filled in for this address: {rate}.': 'Uzupełniono dla tego adresu: {rate}.',
  // The invoice step offers the customer's saved addresses as a list.
  'Saved address': 'Zapisany adres',
  'Choose a customer first': 'Najpierw wybierz klienta',
  'No saved addresses for this customer': 'Ten klient nie ma zapisanych adresów',
  'Not one of the saved addresses': 'Spoza zapisanych adresów',
  'Choose an address': 'Wybierz adres',
  'Saved addresses come from the customer profile.': 'Zapisane adresy pochodzą z profilu klienta.',
  'Add delivery addresses to this customer to pick them here.':
    'Dodaj adresy dostaw do tego klienta, aby wybierać je tutaj.',
  'Rated at this address: {rate}.': 'Stawka pod tym adresem: {rate}.',
  'No rate is saved for this address; enter it below.':
    'Brak zapisanej stawki dla tego adresu; wpisz ją poniżej.',
  'Choosing one fills in the destination and that address’s rate.':
    'Wybór uzupełnia miejsce dostawy i stawkę tego adresu.',
  'No rate is saved for this address; enter the rate for this ticket.':
    'Brak zapisanej stawki dla tego adresu; wpisz stawkę dla tego kwitu.',
  'This customer has no site rates yet; enter the rate for this ticket.':
    'Ten klient nie ma jeszcze stawek dla miejsc; wpisz stawkę dla tego kwitu.',
  'Choose the customer to use its rates.': 'Wybierz klienta, aby użyć jego stawek.',
  'The rate at {address} must be blank, zero or a positive amount.':
    'Stawka w {address} musi być pusta, zerowa lub dodatnia.',
  'Rate {unit}': 'Stawka {unit}',
  Rate: 'Stawka',
  '+ {amount} fuel': '+ {amount} za paliwo',
  'Flat rate': 'Stawka ryczałtowa',
  Hourly: 'Godzinowa',
  'Per ton': 'Za tonę',
  'per load': 'za ładunek',
  'per hour': 'za godzinę',
  'per ton': 'za tonę',
  'Flat amount': 'Stała kwota',
  'Percent of rate': 'Procent stawki',
  flat: 'ryczałt',
  'Week': 'Tydzień',
  'Month': 'Miesiąc',
  'All time': 'Cały okres',

  // Home
  'None last week either': 'W zeszłym tygodniu też brak',
  'None last month either': 'W zeszłym miesiącu też brak',
  'Same as last week': 'Tyle samo co w zeszłym tygodniu',
  'Same as last month': 'Tyle samo co w zeszłym miesiącu',
  '{amount} vs last week': '{amount} względem zeszłego tygodnia',
  '{amount} vs last month': '{amount} względem zeszłego miesiąca',
  '{invoices} waiting for a rate': 'Czeka na stawkę: {invoices}',
  '{tickets} to double-check': 'Do sprawdzenia: {tickets}',
  '{invoices} with fields to confirm': 'Z polami do potwierdzenia: {invoices}',
  'A field the printer cut off, waiting to be checked against the original.':
    'Pole ucięte przez drukarkę, czeka na sprawdzenie z oryginałem.',
  'A field OCR could not read, or weights that do not balance.':
    'Pole, którego OCR nie odczytał, lub wagi, które się nie zgadzają.',
  '{customers} without a profile': 'Bez profilu: {customers}',
  'Add a profile to count their loads and fill in flat rates.':
    'Dodaj profil, aby liczyć ich ładunki i uzupełniać stawki ryczałtowe.',
  'Set up': 'Skonfiguruj',
  '{trucks} without a profile': 'Bez profilu: {trucks}',
  'Add them to track loads per truck.': 'Dodaj je, aby śledzić ładunki każdej ciężarówki.',
  'Add your trucks': 'Dodaj swoje ciężarówki',
  'Pick a truck when uploading and its number goes on the invoice.':
    'Wybierz ciężarówkę przy przesyłaniu, a jej numer trafi na fakturę.',
  'Add trucks': 'Dodaj ciężarówki',
  'Add customers and flat rates': 'Dodaj klientów i stawki ryczałtowe',
  'Tickets for a known customer get its rate filled in.':
    'Kwity znanego klienta dostają jego stawkę automatycznie.',
  'Add customers': 'Dodaj klientów',
  'Upload your first tickets': 'Prześlij pierwsze kwity',
  'Tickets from the same date go on one invoice.':
    'Kwity z tego samego dnia trafiają na jedną fakturę.',
  'Good Morning': 'Dzień dobry',
  'Good Afternoon': 'Dzień dobry',
  'Good Evening': 'Dobry wieczór',
  OVERVIEW: 'PRZEGLĄD',
  Overview: 'Przegląd',
  'Loads, invoices and your fleet at {company}.': 'Ładunki, faktury i flota firmy {company}.',
  'Loading your dashboard…': 'Wczytywanie panelu…',
  'Getting started': 'Pierwsze kroki',
  '{done} of {total} Steps Done': 'Ukończono {done} z {total} kroków',
  done: 'ukończono',
  'Loads this week': 'Ładunki w tym tygodniu',
  '{tons} hauled': 'Przewieziono: {tons}',
  'Billed this month': 'Zafakturowano w tym miesiącu',
  'Rated loads, by ticket date': 'Ładunki ze stawką, według daty kwitu',
  'Needs attention': 'Wymaga uwagi',
  'Draft invoices and tickets to check': 'Szkice faktur i kwity do sprawdzenia',
  'All caught up': 'Wszystko gotowe',
  'To do': 'Do zrobienia',
  'Needs Attention': 'Wymaga uwagi',
  'Nothing needs attention. Every invoice has a rate and every ticket checks out.':
    'Nic nie wymaga uwagi. Każda faktura ma stawkę, a każdy kwit jest poprawny.',
  Latest: 'Najnowsze',
  'Recent Invoices': 'Ostatnie faktury',
  'View all': 'Zobacz wszystkie',
  'No invoices yet.': 'Brak faktur.',
  'to create one.': 'aby utworzyć pierwszą.',
  'Top Customers': 'Najwięksi klienci',
  'Customers appear once tickets are saved.': 'Klienci pojawią się po zapisaniu kwitów.',
  'No driver set': 'Brak kierowcy',
  'No trucks yet.': 'Brak ciężarówek.',
  'to track loads per truck.': 'aby śledzić ładunki każdej ciężarówki.',

  // Customers
  'Customer no. {number}': 'Nr klienta {number}',
  'Matches by profile name': 'Dopasowanie po nazwie profilu',
  'Enter the customer name.': 'Wpisz nazwę klienta.',
  'Rates must be blank, zero or a positive amount.':
    'Stawki muszą być puste, zerowe lub dodatnie.',
  'A customer number here already belongs to {name}. Each number can match one customer.':
    'Jeden z tych numerów klienta należy już do: {name}. Każdy numer może pasować tylko do jednego klienta.',
  'Tickets for this customer are rated one by one.':
    'Kwity tego klienta są wyceniane pojedynczo.',
  'Matching tickets get {rate} {unit} on the invoice.':
    'Pasujące kwity dostaną na fakturze {rate} {unit}.',
  'Edit {name}': 'Edytuj: {name}',
  'Delete {name}': 'Usuń: {name}',
  'CUSTOMERS & CLIENTS': 'KLIENCI I PŁATNICY',
  'Loads hauled for each customer and the rates filled in when a ticket matches, plus the clients you bill.':
    'Ładunki przewiezione dla każdego klienta i stawki uzupełniane przy dopasowaniu kwitu oraz płatnicy, którym wystawiasz faktury.',
  'Loads by customer': 'Ładunki według klientów',
  'Customer Profiles': 'Profile klientów',
  'Add customer': 'Dodaj klienta',
  'Loading customers…': 'Wczytywanie klientów…',
  'No customers yet. Add one, or create a profile from a customer found on saved tickets.':
    'Brak klientów. Dodaj klienta albo utwórz profil z klienta znalezionego na zapisanych kwitach.',
  'Per ticket': 'Za kwit',
  'Rate per ticket': 'Stawka za kwit',
  'Billed {amount} · Last load {date}': 'Zafakturowano {amount} · Ostatni ładunek {date}',
  'From saved tickets': 'Z zapisanych kwitów',
  'Customers Without a Profile': 'Klienci bez profilu',
  '{loads} not counted under a customer': 'Nieprzypisane do klienta: {loads}',
  'Customer {number}': 'Klient {number}',
  'Create profile': 'Utwórz profil',
  'Edit customer': 'Edytuj klienta',
  'When a ticket’s customer number or name matches, Load Desk selects this customer and fills in its rate on the invoice.':
    'Gdy numer lub nazwa klienta na kwicie pasuje, Load Desk wybiera tego klienta i uzupełnia jego stawkę na fakturze.',
  'Customer numbers on tickets': 'Numery klienta na kwitach',
  'The number printed after “Customer:”. Separate several with commas.':
    'Numer drukowany po „Customer:”. Kilka numerów oddziel przecinkami.',
  'Names printed on tickets': 'Nazwy drukowane na kwitach',
  'One per line. A ticket matches when its customer name contains one of these or the profile name.':
    'Jedna w wierszu. Kwit pasuje, gdy nazwa klienta zawiera jedną z nich lub nazwę profilu.',
  'The rate is multiplied by each ticket’s net tons.':
    'Stawka jest mnożona przez tony netto z każdego kwitu.',
  'The rate is multiplied by the hours entered on each ticket.':
    'Stawka jest mnożona przez godziny wpisane na każdym kwicie.',
  'The rate is charged once per load.': 'Stawka jest naliczana raz za ładunek.',
  'Fuel charge per load ($)': 'Dopłata paliwowa za ładunek ($)',
  'Delete {name}?': 'Usunąć: {name}?',
  'Saved tickets and their invoices are kept. They stop counting under this customer, and new tickets no longer get its rate.':
    'Zapisane kwity i ich faktury zostają. Przestaną się liczyć dla tego klienta, a nowe kwity nie dostaną już jego stawki.',
  'Delete customer': 'Usuń klienta',

  // Clients
  'Enter the client name.': 'Wpisz nazwę płatnika.',
  '{name} already has a client profile.': '{name} ma już profil płatnika.',
  'Choose it as the bill-to on an invoice in Load Desk.':
    'Wybierz go jako płatnika faktury w Load Desk.',
  'Edit client {name}': 'Edytuj płatnika: {name}',
  'Delete client {name}': 'Usuń płatnika: {name}',
  'Add client': 'Dodaj płatnika',
  'Loading clients…': 'Wczytywanie płatników…',
  'No clients yet. Add the companies you bill, then choose one as the bill-to on an invoice in Load Desk.':
    'Brak płatników. Dodaj firmy, którym wystawiasz faktury, a potem wybierz jedną jako płatnika faktury w Load Desk.',
  'No address': 'Brak adresu',
  'Edit client': 'Edytuj płatnika',
  'The company printed under Bill To on invoices.':
    'Firma drukowana na fakturach w polu Bill To.',
  'Client name': 'Nazwa płatnika',
  'Delete client {name}?': 'Usunąć płatnika {name}?',
  'Saved invoices keep their bill-to details. The client can no longer be chosen in Load Desk.':
    'Zapisane faktury zachowują dane płatnika. Nie będzie można go już wybrać w Load Desk.',
  'Delete client': 'Usuń płatnika',

  // Truck Fleet
  'Enter the truck number printed on invoices.':
    'Wpisz numer ciężarówki drukowany na fakturach.',
  'Truck #{number} already has a profile.': 'Ciężarówka nr {number} ma już profil.',
  'Updated truck #{number}': 'Zaktualizowano ciężarówkę nr {number}',
  'Added truck #{number}': 'Dodano ciężarówkę nr {number}',
  'Choose it in Load Desk before extracting tickets.':
    'Wybierz ją w Load Desk przed odczytaniem kwitów.',
  'Inactive trucks are hidden when uploading tickets.':
    'Nieaktywne ciężarówki są ukryte przy przesyłaniu kwitów.',
  'Deleted truck #{number}': 'Usunięto ciężarówkę nr {number}',
  'Edit truck {number}': 'Edytuj ciężarówkę {number}',
  'Delete truck {number}': 'Usuń ciężarówkę {number}',
  'TRUCK FLEET': 'FLOTA CIĘŻARÓWEK',
  'Trucks for {company}. Choose one when uploading tickets and its number goes on the invoice.':
    'Ciężarówki firmy {company}. Wybierz jedną przy przesyłaniu kwitów, a jej numer trafi na fakturę.',
  'Add truck': 'Dodaj ciężarówkę',
  'Loading trucks…': 'Wczytywanie ciężarówek…',
  'No trucks yet. Add each truck once, then choose it when uploading tickets so invoices get its number.':
    'Brak ciężarówek. Dodaj każdą ciężarówkę raz, a potem wybieraj ją przy przesyłaniu kwitów, by jej numer trafiał na faktury.',
  'No nickname or plate': 'Brak nazwy i tablicy',
  'No details yet': 'Brak szczegółów',
  'From saved invoices': 'Z zapisanych faktur',
  'Truck Numbers Without a Profile': 'Numery ciężarówek bez profilu',
  '{loads} not counted under a truck': 'Nieprzypisane do ciężarówki: {loads}',
  'Edit truck': 'Edytuj ciężarówkę',
  'Choose this truck in Load Desk before extracting tickets and its number goes on each invoice.':
    'Wybierz tę ciężarówkę w Load Desk przed odczytaniem kwitów, a jej numer trafi na każdą fakturę.',
  'Truck number': 'Numer ciężarówki',
  Nickname: 'Nazwa',
  'License plate': 'Tablica rejestracyjna',
  'Inactive trucks keep their history but are hidden when uploading tickets.':
    'Nieaktywne ciężarówki zachowują historię, ale są ukryte przy przesyłaniu kwitów.',
  'Delete truck #{number}?': 'Usunąć ciężarówkę nr {number}?',
  'Saved tickets and invoices keep their truck number. To keep the truck’s load history on this page, mark it inactive instead.':
    'Zapisane kwity i faktury zachowują numer ciężarówki. Aby zachować historię ładunków na tej stronie, oznacz ją jako nieaktywną.',
  'Delete truck': 'Usuń ciężarówkę',

  // Invoices & Tickets
  'All invoices': 'Wszystkie faktury',
  'Draft (rate missing)': 'Szkic (brak stawki)',
  'All tickets': 'Wszystkie kwity',
  'No ticket dates': 'Brak dat kwitów',
  'Tickets {date}': 'Kwity {date}',
  'Tickets {first} – {last}': 'Kwity {first} – {last}',
  'Edit invoice {number}': 'Edytuj fakturę {number}',
  'Edit ticket {number}': 'Edytuj kwit {number}',
  'Invoice {invoice} for ticket {ticket}': 'Faktura {invoice} dla kwitu {ticket}',
  'Original of ticket {number}': 'Oryginał kwitu {number}',
  'Delete ticket {number}': 'Usuń kwit {number}',
  'No rate yet': 'Brak stawki',
  RECORDS: 'REJESTR',
  'Every invoice and load ticket saved in Load Desk. Search, filter, edit, reprint an invoice or export what you see.':
    'Wszystkie faktury i kwity zapisane w Load Desk. Wyszukuj, filtruj, edytuj, drukuj ponownie faktury lub eksportuj to, co widzisz.',
  Database: 'Baza danych',
  'Load Tickets': 'Kwity ładunków',
  Show: 'Pokaż',
  'Search invoices and tickets': 'Szukaj faktur i kwitów',
  'Search ticket #, invoice #, customer, destination, truck…':
    'Szukaj nr kwitu, nr faktury, klienta, celu, ciężarówki…',
  'Ticket date from': 'Data kwitu od',
  'Ticket date to': 'Data kwitu do',
  'All customers': 'Wszyscy klienci',
  'All trucks': 'Wszystkie ciężarówki',
  'Showing {shown} of {total}': 'Pokazano: {shown} / {total}',
  'Clear filters': 'Wyczyść filtry',
  'Export CSV': 'Eksportuj CSV',
  'Loading saved records…': 'Wczytywanie zapisanych danych…',
  'Nothing saved yet. Tickets and their invoices appear here after you save them in':
    'Nic jeszcze nie zapisano. Kwity i ich faktury pojawią się tutaj po zapisaniu ich w',
  'No invoices match these filters.': 'Żadna faktura nie pasuje do filtrów.',
  'No tickets match these filters.': 'Żaden kwit nie pasuje do filtrów.',
  'Ticket #': 'Nr kwitu',
  'Ticket date': 'Data kwitu',
  'Customer · product': 'Klient · produkt',
  'Origin → destination': 'Skąd → dokąd',
  'Invoice · truck': 'Faktura · ciężarówka',
  'Unknown plant': 'Nieznany zakład',
  'Edited {date}': 'Edytowano {date}',
  'No product': 'Brak produktu',
  'No truck #': 'Brak nr ciężarówki',
  'No rate': 'Brak stawki',
  'No destination': 'Brak celu',
  'This permanently removes the saved record and its stored original for everyone in your workspace, and takes its line off invoice {number}. The invoice number can be reused once every ticket on it is deleted.':
    'Trwale usuwa zapisany rekord i jego oryginał dla wszystkich w obszarze roboczym oraz zdejmuje jego pozycję z faktury {number}. Numer faktury można użyć ponownie po usunięciu wszystkich jej kwitów.',

  // Invoice preview
  'Tickets on this invoice: {count}.': 'Kwity na tej fakturze: {count}.',
  'Draft until every line has a rate (and hours on hourly lines).':
    'Szkic, dopóki każda pozycja nie ma stawki (i godzin przy stawce godzinowej).',
  'Every line has a rate.': 'Każda pozycja ma stawkę.',
  'To save a PDF, print and choose Save as PDF.':
    'Aby zapisać PDF, wydrukuj i wybierz Zapisz jako PDF.',
  'Print or save PDF': 'Drukuj lub zapisz PDF',

  // Load Desk: ticket fields
  'Ticket / BOL': 'Kwit / list przewozowy',
  Date: 'Data',
  'Time in': 'Godzina wjazdu',
  'Time out': 'Godzina wyjazdu',
  'Plant code': 'Kod zakładu',
  'Plant name': 'Nazwa zakładu',
  Dispatch: 'Dyspozycja',
  'Customer ID': 'ID klienta',
  'Order number': 'Numer zamówienia',
  Project: 'Projekt',
  'Destination address': 'Adres docelowy',
  PO: 'Nr zamówienia (PO)',
  'Product code': 'Kod produktu',
  'Product description': 'Opis produktu',
  'Gross pounds': 'Brutto (lb)',
  'Tare pounds': 'Tara (lb)',
  'Net pounds': 'Netto (lb)',
  'Carrier ID': 'ID przewoźnika',
  'Carrier name': 'Nazwa przewoźnika',
  Vehicle: 'Pojazd',
  Hours: 'Godziny',
  'Fuel charge ($)': 'Dopłata paliwowa ($)',
  'Customer and Job': 'Klient i zlecenie',
  'Weight and Hauling': 'Waga i transport',

  // Load Desk: messages
  'Enter gross, tare and net pounds to check the balance.':
    'Wpisz wagę brutto, tarę i netto w funtach, aby sprawdzić bilans.',
  'Gross minus tare matches net within {difference} lb.':
    'Brutto minus tara zgadza się z netto z dokładnością do {difference} lb.',
  'Gross minus tare is {weight} lb, {difference} lb off the net weight.':
    'Brutto minus tara to {weight} lb, o {difference} lb różni się od wagi netto.',
  'Text file. Its contents are under Ticket text.':
    'Plik tekstowy. Jego treść jest w polu Tekst kwitu.',
  'Loading the stored original…': 'Wczytywanie zapisanego oryginału…',
  'The original is not stored for this ticket.': 'Oryginał tego kwitu nie jest zapisany.',
  'Original: {name}': 'Oryginał: {name}',
  'Original ticket {name}': 'Oryginał kwitu {name}',
  'Pinch or scroll to zoom': 'Przybliż gestem lub kółkiem',
  'Zoom in': 'Przybliż',
  'Zoom out': 'Oddal',
  'Fit to screen': 'Dopasuj do ekranu',
  'Magnify the original ticket': 'Powiększ oryginał kwitu',
  'This browser cannot preview {name}. It is still stored with the record.':
    'Ta przeglądarka nie może wyświetlić {name}. Plik jest nadal zapisany z rekordem.',
  'use PDF, PNG, JPG, TIFF, WebP or text': 'użyj PDF, PNG, JPG, TIFF, WebP lub pliku tekstowego',
  'the file is empty': 'plik jest pusty',
  'the file is larger than 20 MB': 'plik jest większy niż 20 MB',
  'Added {tickets} to invoice {number}': 'Dodano do faktury {number}: {tickets}',
  'Added {tickets} to the invoice being reviewed': 'Dodano do sprawdzanej faktury: {tickets}',
  'No tickets were added': 'Nie dodano żadnych kwitów',
  'No tickets were added.': 'Nie dodano żadnych kwitów.',
  'Review and save each new ticket.': 'Sprawdź i zapisz każdy nowy kwit.',
  '{tickets} ready for review on {invoices}, one per ticket date.':
    'Gotowe do sprawdzenia: {tickets} na fakturach ({invoices}), po jednej na każdą datę kwitu.',
  '{tickets} ready for review.': 'Gotowe do sprawdzenia: {tickets}.',
  'No customer on this scan': 'Brak klienta na tym skanie',
  'The ticket has no customer name or number. Enter them in Customer and Job first.':
    'Kwit nie ma nazwy ani numeru klienta. Najpierw wpisz je w sekcji Klient i zlecenie.',
  '{name} already has a customer profile': '{name} ma już profil klienta',
  'It is now chosen for this ticket.': 'Został wybrany dla tego kwitu.',
  '{name} already has a customer profile. Choose it from the list.':
    '{name} ma już profil klienta. Wybierz go z listy.',
  'Added customer {name}': 'Dodano klienta {name}',
  'Made from the scanned ticket. Edit it any time on Customers & Clients.':
    'Utworzono ze zeskanowanego kwitu. Możesz go edytować w każdej chwili na stronie Klienci i płatnicy.',
  'Enter the client company name.': 'Wpisz nazwę firmy płatnika.',
  '{name} already has a client profile. Choose it from the list.':
    '{name} ma już profil płatnika. Wybierz go z listy.',
  'Added client {name}': 'Dodano płatnika {name}',
  'This invoice is billed to it, and it can be chosen on future invoices.':
    'Ta faktura jest wystawiona na niego i można go wybierać na kolejnych fakturach.',
  'Choose the client this invoice is billed to, or create a new client.':
    'Wybierz płatnika tej faktury albo utwórz nowego.',
  'This file is already saved as record {id} (ticket {ticket}). Nothing was added.':
    'Ten plik jest już zapisany jako rekord {id} (kwit {ticket}). Nic nie dodano.',
  'Invoice number {number} is already used by another upload. Choose another.':
    'Numer faktury {number} jest już użyty przy innym przesłaniu. Wybierz inny.',
  'Invoice numbers now run from {start}; the other invoices moved along.':
    'Numery faktur biegną teraz od {start}; pozostałe faktury przesunięto.',
  'Invoice numbers now run from {start} in date order; this invoice is {number}.':
    'Numery faktur biegną teraz od {start} w kolejności dat; ta faktura ma numer {number}.',
  'Saved {label}. Now reviewing ticket {next}.': 'Zapisano {label}. Teraz sprawdzasz kwit {next}.',
  // Reviewing runs on from one ticket to the next without going back to a list.
  'All tickets reviewed ({tickets}).': 'Sprawdzono wszystkie kwity ({tickets}).',
  'Now reviewing ticket {next}.': 'Teraz sprawdzasz kwit {next}.',
  // The run is the invoice's own: an invoice is what gets sent.
  // A ticket whose date was corrected goes to the invoice of that date.
  'Moved to invoice {number}, with the other tickets for {date}.':
    'Przeniesiono na fakturę {number}, razem z pozostałymi kwitami z {date}.',
  'Moved to its own invoice, {number}, for {date}.':
    'Przeniesiono na osobną fakturę {number} z {date}.',
  '(waiting)': '(oczekuje)',
  'Invoice {number} · Ticket {index} of {total}':
    'Faktura {number} · Kwit {index} z {total}',
  'Every ticket in the queue is saved ({tickets}).':
    'Wszystkie kwity w kolejce są zapisane ({tickets}).',
  'Saved ticket {label}': 'Zapisano kwit {label}',
  'Invoice {number} is a draft until its rate is complete.':
    'Faktura {number} jest szkicem, dopóki stawka nie zostanie uzupełniona.',
  'Invoice {number} created.': 'Utworzono fakturę {number}.',
  // A batch filed but not yet numbered: the numbers of an upload are handed out
  // in ticket-date order once every page of it has been read.
  'Waiting for the rest of this upload': 'Czeka na resztę tego przesłania',
  // A ticket with no date read off it waits on no invoice until the date is
  // entered.
  'Date not found': 'Nie znaleziono daty',
  // The batch list on Load Desk: one line per invoice.
  '{count} to check': '{count} do sprawdzenia',
  'all checked': 'wszystkie sprawdzone',
  'All checked': 'Wszystkie sprawdzone',
  '{tons} tons': '{tons} t',
  'Needs a rate': 'Wymaga stawki',
  'Date not found · no invoice yet': 'Nie znaleziono daty · jeszcze bez faktury',
  'Waiting for a number': 'Czeka na numer',
  'Date not found on {tickets}': 'Nie znaleziono daty na {tickets}',
  'No date was detected on {tickets}, now waiting in “Date not found”. Enter the date to put each on an invoice.':
    'Nie wykryto daty na {tickets}; czekają w „Nie znaleziono daty”. Wpisz datę, aby każdy trafił na fakturę.',
  'Given once the ticket has a date: enter it in step 1.':
    'Nadawany, gdy kwit ma datę: wpisz ją w kroku 1.',
  'No date was detected on this ticket. Read it off the original and enter it below; the ticket then goes on that day’s invoice.':
    'Na tym kwicie nie wykryto daty. Odczytaj ją z oryginału i wpisz poniżej; kwit trafi wtedy na fakturę z tego dnia.',
  'Waiting for the rest of this upload to be read.':
    'Czeka na odczytanie reszty tego przesłania.',
  'Filed. Waiting for the rest of this upload':
    'Zapisano. Czeka na resztę tego przesłania',
  'Finalizing invoice numbers…': 'Ustalanie numerów faktur…',
  'The original could not be stored in this browser.':
    'Nie udało się zapisać oryginału w tej przeglądarce.',
  'Saved changes to {tickets} on invoice {number}.':
    'Zapisano zmiany na fakturze {number} ({tickets}).',
  'Changes saved.': 'Zmiany zapisane.',
  'Updated invoice {number}': 'Zaktualizowano fakturę {number}',
  'Updated ticket {label}': 'Zaktualizowano kwit {label}',
  'Saved with your changes: {tickets}.': 'Zapisano z Twoimi zmianami: {tickets}.',
  'Your changes are saved for everyone in your workspace.':
    'Twoje zmiany są zapisane dla wszystkich w obszarze roboczym.',
  'Clear the unreadable saved tickets in this browser? This cannot be undone.':
    'Wyczyścić nieczytelne zapisane kwity w tej przeglądarce? Tego nie można cofnąć.',
  '{name} (no client profile)': '{name} (brak profilu płatnika)',
  'Choose a client': 'Wybierz płatnika',
  '+ Create new client': '+ Utwórz nowego płatnika',
  'No address or phone on this client profile.':
    'Ten profil płatnika nie ma adresu ani telefonu.',
  'This invoice’s bill-to has no client profile. Choose a client, or create one from it.':
    'Płatnik tej faktury nie ma profilu. Wybierz płatnika albo utwórz go z tych danych.',
  'Choose who this invoice is billed to.': 'Wybierz, na kogo wystawiona jest faktura.',
  'No clients yet. Create one to bill this invoice.':
    'Brak płatników. Utwórz płatnika, aby wystawić tę fakturę.',
  'Filled in: {rate}.': 'Uzupełniono: {rate}.',
  'This customer has no default rate; enter the rate for this ticket.':
    'Ten klient nie ma domyślnej stawki; wpisz stawkę dla tego kwitu.',
  'No customer profile matches this ticket.': 'Żaden profil klienta nie pasuje do tego kwitu.',
  'Choose the customer to use its rate.': 'Wybierz klienta, aby użyć jego stawki.',
  'Truck #{number} on the invoice': 'Ciężarówka nr {number} na fakturze',
  'Driver {name}': 'Kierowca {name}',
  'Truck #{number} on the invoice. Choose a truck profile to change it.':
    'Ciężarówka nr {number} na fakturze. Wybierz profil ciężarówki, aby to zmienić.',
  'Choose a truck; its number goes on the invoice.':
    'Wybierz ciężarówkę; jej numer trafi na fakturę.',
  'Shared by every ticket on this invoice ({tickets}). Changes to invoice details apply to all of them; rates stay per ticket.':
    'Wspólne dla wszystkich kwitów na tej fakturze ({tickets}). Zmiany danych faktury dotyczą ich wszystkich; stawki pozostają osobne dla każdego kwitu.',
  'Weights do not balance': 'Wagi się nie zgadzają',
  'Extracting file {index} of {total}': 'Odczytywanie pliku {index} z {total}',
  'Extracting tickets': 'Odczytywanie kwitów',
  'Extracting tickets…': 'Odczytywanie kwitów…',
  'Nothing entered yet': 'Nic jeszcze nie wpisano',
  Saved: 'Zapisano',
  'Save & review next': 'Zapisz i sprawdź następny',
  'Save ticket & create invoice': 'Zapisz kwit i utwórz fakturę',
  'Ticket not found': 'Nie znaleziono kwitu',
  'It may have been deleted. Nothing was opened.': 'Mógł zostać usunięty. Nic nie otwarto.',

  // Load Desk: page
  'Load Tickets to Invoices': 'Z kwitów do faktur',
  'Upload tickets, check the extracted fields, then save each one with its original and an invoice.':
    'Prześlij kwity, sprawdź odczytane pola, a potem zapisz każdy z oryginałem i fakturą.',
  'Saved tickets': 'Zapisane kwity',
  '01 · Upload': '01 · Przesyłanie',
  'New Load Tickets': 'Nowe kwity',
  'PDF, image or text · 20 MB each': 'PDF, obraz lub tekst · do 20 MB każdy',
  'Add more tickets': 'Dodaj więcej kwitów',
  'Drop tickets here': 'Upuść kwity tutaj',
  'Files added now wait for the next extraction':
    'Dodane teraz pliki poczekają na następny odczyt',
  'Drop or click to add files to the list below':
    'Upuść lub kliknij, aby dodać pliki do listy poniżej',
  'or click to choose one or several files': 'lub kliknij, aby wybrać jeden lub kilka plików',
  'Ready to extract: {files}': 'Gotowe do odczytu: {files}',
  Clear: 'Wyczyść',
  'Remove {name}': 'Usuń {name}',
  'Tickets from the same date go on one invoice, dated that day. Tickets from different dates get separate invoices.':
    'Kwity z tego samego dnia trafiają na jedną fakturę z tą datą. Kwity z różnych dni dostają osobne faktury.',
  'Truck for these tickets': 'Ciężarówka dla tych kwitów',
  'No truck profile': 'Bez profilu ciężarówki',
  'Its truck number goes on every invoice from this upload.':
    'Jej numer trafi na każdą fakturę z tego przesłania.',
  'Add trucks in': 'Dodaj ciężarówki na stronie',
  'to choose one here.': 'aby wybrać jedną tutaj.',
  'Extract tickets': 'Odczytaj kwity',
  Ledger: 'Rejestr',
  'Saved Tickets': 'Zapisane kwity',
  'All invoices & tickets': 'Wszystkie faktury i kwity',
  'Ledger CSV': 'Rejestr CSV',
  'Clear saved tickets': 'Wyczyść zapisane kwity',
  'Loading saved tickets…': 'Wczytywanie zapisanych kwitów…',
  'No tickets saved yet. In this local preview they stay in this browser.':
    'Brak zapisanych kwitów. W tym podglądzie lokalnym zostają w tej przeglądarce.',
  'No tickets saved yet.': 'Brak zapisanych kwitów.',
  '02 · Review': '02 · Sprawdzanie',
  'Ticket {index} of {total}': 'Kwit {index} z {total}',
  'Ticket queue': 'Kolejka kwitów',
  'Previous ticket': 'Poprzedni kwit',
  'Next ticket': 'Następny kwit',
  'Ticket {index}: {name}': 'Kwit {index}: {name}',
  saved: 'zapisany',
  'unsaved changes': 'niezapisane zmiany',
  '{saved} of {total} saved': 'Zapisano {saved} z {total}',
  'Clear queue': 'Wyczyść kolejkę',
  'Not found': 'Nie znaleziono',
  'Unsaved changes': 'Niezapisane zmiany',
  'Saved as record {id}': 'Zapisano jako rekord {id}',
  'To review: {items}': 'Do sprawdzenia: {items}',
  'Ready to save': 'Gotowe do zapisu',
  'Check before saving': 'Sprawdź przed zapisem',
  'All checks pass.': 'Wszystkie kontrole zaliczone.',
  'Add tickets to this invoice': 'Dodaj kwity do tej faktury',
  'They join invoice {number}, whatever their ticket dates.':
    'Trafią na fakturę {number}, niezależnie od dat kwitów.',
  'They join the invoice being reviewed, whatever their ticket dates.':
    'Trafią na sprawdzaną fakturę, niezależnie od dat kwitów.',
  'e.g. 1001': 'np. 1001',
  'Enter your first invoice number. The ones after it follow in order.':
    'Wpisz numer pierwszej faktury. Kolejne będą numerowane po nim.',
  'Customer profile': 'Profil klienta',
  'No customer profile': 'Bez profilu klienta',
  '+ Create new customer': '+ Utwórz nowego klienta',
  'Check the name below, then save the customer.':
    'Sprawdź nazwę poniżej, a potem zapisz klienta.',
  'No customer profile matches this ticket. Choose + Create new customer to add it from the scan.':
    'Żaden profil klienta nie pasuje do tego kwitu. Wybierz + Utwórz nowego klienta, aby dodać go ze skanu.',
  'New customer': 'Nowy klient',
  'Scanned as {name}': 'Zeskanowano jako {name}',
  'customer number {number}': 'numer klienta {number}',
  'Tickets with the scanned name or number will match this customer.':
    'Kwity z zeskanowaną nazwą lub numerem będą pasować do tego klienta.',
  'Save customer': 'Zapisz klienta',
  'Truck profile': 'Profil ciężarówki',
  'Bill to client': 'Płatnik faktury',
  'Manage clients': 'Zarządzaj płatnikami',
  'New client': 'Nowy płatnik',
  'Address line 1': 'Adres, wiersz 1',
  'Address line 2': 'Adres, wiersz 2',
  'Save client': 'Zapisz płatnika',
  'Ticket saved': 'Kwit zapisany',
  'Ready to save?': 'Gotowe do zapisu?',
  'Saving updates the saved tickets on this invoice ({tickets}) for everyone in your workspace.':
    'Zapis zaktualizuje zapisane kwity na tej fakturze ({tickets}) dla wszystkich w obszarze roboczym.',
  'Saving updates this saved ticket for everyone in your workspace.':
    'Zapis zaktualizuje ten kwit dla wszystkich w obszarze roboczym.',
  'Change any field to edit this ticket or its invoice, then save the changes.':
    'Zmień dowolne pole, aby edytować ten kwit lub jego fakturę, a potem zapisz zmiany.',
  'The original file is stored with this record. Without a rate the invoice stays a draft.':
    'Oryginalny plik jest zapisywany z tym rekordem. Bez stawki faktura pozostaje szkicem.',
  'Preview invoice': 'Podgląd faktury',
  'Source ticket': 'Kwit źródłowy',
  'This permanently removes the saved record and its stored original for everyone in your workspace, and takes its line off invoice {number}. The same file can then be uploaded again; the invoice number can be reused once every ticket on it is deleted.':
    'Trwale usuwa zapisany rekord i jego oryginał dla wszystkich w obszarze roboczym oraz zdejmuje jego pozycję z faktury {number}. Ten sam plik można potem przesłać ponownie; numer faktury można użyć ponownie po usunięciu wszystkich jej kwitów.',

  // Ticket checks and line totals
  'Rate is missing': 'Brak stawki',
  'Hours are missing for the hourly rate; invoice remains a draft':
    'Brak godzin dla stawki godzinowej; faktura pozostaje szkicem',
  'Net tons do not match net pounds / 2,000': 'Tony netto nie zgadzają się z funtami netto / 2000',
  'ticket number': 'numer kwitu',
  'ticket date': 'data kwitu',
  'customer name': 'nazwa klienta',
  'net weight': 'waga netto',
  product: 'produkt',
  'Draft until a rate is added.': 'Szkic, dopóki nie dodasz stawki.',
  'Enter the hours to work out the total.': 'Wpisz godziny, aby obliczyć wartość.',
  'Enter the net weight to work out the total.': 'Wpisz wagę netto, aby obliczyć wartość.',

  // Extraction progress
  Starting: 'Rozpoczynanie',
  'Starting text recognition': 'Uruchamianie rozpoznawania tekstu',
  'Opening page': 'Otwieranie strony',
  'Reading text': 'Odczytywanie tekstu',
  'Checking ticket fields': 'Sprawdzanie pól kwitu',
  'Checking weights': 'Sprawdzanie wag',
  Done: 'Gotowe',

  // Storage messages
  'A ticket you changed no longer exists. Reload and try again.':
    'Zmieniony kwit już nie istnieje. Odśwież stronę i spróbuj ponownie.',
  'Browser storage is unavailable, so profiles cannot be saved here.':
    'Pamięć przeglądarki jest niedostępna, więc nie można tu zapisać profili.',
  'Browser storage is unavailable, so tickets cannot be saved here.':
    'Pamięć przeglądarki jest niedostępna, więc nie można tu zapisać kwitów.',
  'Saved tickets in this browser could not be read and were left untouched.':
    'Nie udało się odczytać kwitów zapisanych w tej przeglądarce; pozostawiono je bez zmian.',
  'Your session has ended. Sign in again to see customers and trucks.':
    'Sesja wygasła. Zaloguj się ponownie, aby zobaczyć klientów i ciężarówki.',
  'Your session has ended. Sign in again to see saved tickets.':
    'Sesja wygasła. Zaloguj się ponownie, aby zobaczyć zapisane kwity.',
  'Your session has ended. Sign in again.': 'Sesja wygasła. Zaloguj się ponownie.',
  'Allow pop-ups to open the original.': 'Zezwól na wyskakujące okna, aby otworzyć oryginał.',
  'Could not open original storage.': 'Nie udało się otworzyć magazynu oryginałów.',
  'Original storage failed.': 'Zapis oryginału nie powiódł się.',
  'Original storage was aborted.': 'Zapis oryginału został przerwany.',
  'This browser cannot store original files.': 'Ta przeglądarka nie może zapisywać oryginałów.',
  'Could not write to browser storage. Nothing was changed.':
    'Nie udało się zapisać w pamięci przeglądarki. Nic nie zmieniono.',

  // Mileage
  MILEAGE: 'PRZEBIEG',
  Mileage: 'Przebieg',
  'IFTA reporting': 'Raportowanie IFTA',
  Yard: 'Baza',
  'No pickup address': 'Brak adresu załadunku',
  'No delivery address': 'Brak adresu dostawy',
  'Days to review': 'Dni do sprawdzenia',
  'Mileage is worked out on the server and is not available in the local preview.':
    'Przebieg jest liczony na serwerze i nie jest dostępny w podglądzie lokalnym.',
  'Mileage routing is not configured on this deployment. Ask Monius to add the routing key.':
    'Wyznaczanie tras nie jest skonfigurowane w tym wdrożeniu. Poproś Monius o dodanie klucza.',
  '{trucks} without a yard address: {numbers}. Enter each truck’s yard in Truck Fleet.':
    'Bez adresu bazy: {trucks} ({numbers}). Wpisz bazę każdej ciężarówki we Flocie.',
  'Open Truck Fleet': 'Otwórz Flotę ciężarówek',
  'This Week': 'Ten tydzień',
  'This Month': 'Ten miesiąc',
  'This quarter': 'Ten kwartał',
  'Last quarter': 'Poprzedni kwartał',
  mi: 'mi',
  '{n} to review': 'Do sprawdzenia: {n}',
  'Estimated Fuel Used = route miles ÷ average MPG. Not purchased fuel.':
    'Szacowane zużycie paliwa = mile trasy ÷ średnie MPG. To nie jest zakupione paliwo.',
  'Loading mileage…': 'Wczytywanie przebiegu…',
  Route: 'Trasa',
  'Est. miles': 'Szac. mile',
  'Est. fuel used': 'Szac. zużycie paliwa',
  Details: 'Szczegóły',
  Miles: 'Mile',
  MPG: 'MPG',
  Fuel: 'Paliwo',
  Time: 'Czas',
  'Updating…': 'Aktualizowanie…',
  Current: 'Aktualne',
  Failed: 'Nieudane',
  'Settings changed': 'Zmieniono ustawienia',
  'No yard address on this truck.': 'Ta ciężarówka nie ma adresu bazy.',
  'Could not place “{query}”.': 'Nie udało się zlokalizować „{query}”.',
  'Ticket {number} has no pickup address.': 'Kwit {number} nie ma adresu załadunku.',
  'Ticket {number} has no delivery address.': 'Kwit {number} nie ma adresu dostawy.',
  'No truck route found: {detail}': 'Nie znaleziono trasy dla ciężarówki: {detail}',
  'Too many tickets on one day to route ({count}).':
    'Za dużo kwitów jednego dnia, aby wyznaczyć trasę ({count}).',
  'No average MPG on this truck, so fuel cannot be estimated.':
    'Ta ciężarówka nie ma średniego MPG, więc nie można oszacować paliwa.',
  'Open ticket': 'Otwórz kwit',
  Retry: 'Ponów',
  Recalculate: 'Przelicz',
  'Location saved': 'Zapisano lokalizację',
  'Street address': 'Adres',
  'Save location': 'Zapisz lokalizację',
  'Ticket {number}': 'Kwit {number}',
  'That address was not found. Check the street, city and state.':
    'Nie znaleziono tego adresu. Sprawdź ulicę, miasto i stan.',
  'That address is not precise enough. Add the street, city and state, or use a nearby address or business name.':
    'Ten adres nie jest wystarczająco dokładny. Dodaj ulicę, miasto i stan albo podaj pobliski adres lub nazwę firmy.',
  'That place is not on any ticket.': 'Tego miejsca nie ma na żadnym kwicie.',
  'Your session has ended. Sign in again to see mileage.':
    'Sesja wygasła. Zaloguj się ponownie, aby zobaczyć przebieg.',
  'The routing service did not answer. Try again.':
    'Usługa wyznaczania tras nie odpowiedziała. Spróbuj ponownie.',

  // Mileage: the route map
  'Route map': 'Mapa trasy',
  'Open in Google Maps': 'Otwórz w Mapach Google',
  'Not on the map': 'Poza mapą',
  Loaded: 'Z ładunkiem',
  Empty: 'Bez ładunku',

  // Mileage (simple)
  'visited {n} times': 'odwiedzono {n} razy',
  // The page a dispatcher reads: the cards, the route one of them opens, and
  // the plain words for whatever a day needs a person for.
  'See where each truck drove and how many miles it traveled.':
    'Zobacz, gdzie jeździła każda ciężarówka i ile mil przejechała.',
  'Miles Today': 'Mile dzisiaj',
  'Miles This Week': 'Mile w tym tygodniu',
  'Miles This Month': 'Mile w tym miesiącu',
  'Estimated Fuel Used': 'Szacowane zużycie paliwa',
  Showing: 'Okres',
  'Route miles from each day’s tickets': 'Mile z tras według kwitów każdego dnia',
  'Trucks with miles {when}': 'Ciężarówki z milami {when}',
  'Per truck and day': 'Według ciężarówki i dnia',
  'Daily mileage': 'Dzienny przebieg',
  'Estimated Fuel Used is miles ÷ average MPG. It is not fuel purchased.':
    'Szacowane zużycie paliwa to mile ÷ średnie MPG. To nie jest paliwo zakupione.',
  'Mileage is worked out on the server and isn’t available in this preview.':
    'Przebieg jest liczony na serwerze i nie jest dostępny w tym podglądzie.',
  'Mileage can’t be calculated on this site yet. Ask Monius to finish the setup.':
    'Przebiegu nie da się jeszcze liczyć na tej stronie. Poproś Monius o dokończenie konfiguracji.',
  'Truck {number} needs a home yard before mileage can be calculated.':
    'Ciężarówka {number} potrzebuje adresu bazy, aby obliczyć przebieg.',
  'Set yard': 'Ustaw bazę',
  'No mileage yet {when}. Mileage appears automatically after tickets are added.':
    'Brak przebiegu {when}. Przebieg pojawia się automatycznie po dodaniu kwitów.',
  '{tickets} aren’t counted because they have no truck or date.':
    '{tickets} nie są liczone, bo brakuje w nich ciężarówki lub daty.',
  'Open Records': 'Otwórz Faktury i kwity',
  'Routes follow roads open to each truck’s size and weight, as far as TomTom’s map allows. Miles are estimates.':
    'Trasy prowadzą drogami dostępnymi dla rozmiaru i masy każdej ciężarówki, na ile pozwala mapa TomTom. Mile są szacunkowe.',
  'Could not update the mileage': 'Nie udało się zaktualizować przebiegu',

  // A card, and the one line that says where a day stands.
  'Truck {number}': 'Ciężarówka {number}',
  miles: 'mil',
  'Estimated fuel: {gal} gal': 'Szacowane paliwo: {gal} gal',
  'View route': 'Pokaż trasę',
  'View route for truck {number} on {date}': 'Pokaż trasę ciężarówki {number} z dnia {date}',
  'Needs your help': 'Wymaga Twojej pomocy',
  'Couldn’t update': 'Nie udało się zaktualizować',
  'Calculating today’s route…': 'Obliczanie trasy tego dnia…',
  'Last updated {date}': 'Ostatnia aktualizacja {date}',

  // Which way the truck goes between two places, settled once for every load
  // that drives it.
  'Routes this day uses': 'Trasy tego dnia',
  'Change route': 'Zmień trasę',
  'Change the route from {from} to {to}': 'Zmień trasę z {from} do {to}',
  '{n} times today': '{n} razy tego dnia',
  'A route you choose is used for every trip between those two places, today and on the days ahead.':
    'Wybrana trasa jest używana dla każdego przejazdu między tymi miejscami, dziś i w kolejne dni.',
  'It drives this {n} times on this day.': 'Ciężarówka pokonuje ją tego dnia {n} razy.',
  'Pick the roads the truck really takes.': 'Wybierz drogi, którymi naprawdę jedzie ciężarówka.',
  'Looking up the routes…': 'Szukamy możliwych tras…',
  'Route {n}': 'Trasa {n}',
  'Fewest miles': 'Najmniej mil',
  Quickest: 'Najszybsza',
  'In use now': 'Używana teraz',
  'Use this route': 'Użyj tej trasy',
  'Route saved': 'Trasa zapisana',
  'Used on {n} days that drive this run.': 'Używana w {n} dniach z tym przejazdem.',
  'Used for every trip between these two places.':
    'Używana dla każdego przejazdu między tymi miejscami.',
  'The miles are the route’s own, off the map. Choosing one changes what this run is worth on every day the truck drives it.':
    'Mile pochodzą z samej trasy na mapie. Wybór trasy zmienia jej wartość w każdym dniu, w którym występuje.',
  'That part of the day is not routed.': 'Ta część dnia nie ma wyznaczonej trasy.',
  'That way is no longer offered. Look at the ways again.':
    'Ta trasa nie jest już dostępna. Sprawdź trasy ponownie.',
  'Your session has ended. Sign in again to choose a route.':
    'Sesja wygasła. Zaloguj się ponownie, aby wybrać trasę.',

  // The day's route, in the order it was driven.
  'Back to all trucks': 'Wróć do wszystkich ciężarówek',
  'Truck {number} · {date}': 'Ciężarówka {number} · {date}',
  'Estimated fuel': 'Szacowane paliwo',
  'Average MPG {mpg}': 'Średnie MPG {mpg}',
  'Home yard': 'Baza',
  Start: 'Start',
  Finish: 'Koniec',
  'Show details': 'Pokaż szczegóły',
  'Hide details': 'Ukryj szczegóły',
  '{miles} miles': '{miles} mil',
  '{hours} hr {minutes} min': '{hours} godz {minutes} min',
  '{minutes} min': '{minutes} min',
  'Update mileage': 'Zaktualizuj przebieg',

  // The drawing of the roads.
  'Start/Finish': 'Start/Koniec',
  'Route with {stops} stops, from {start} to {finish}':
    'Trasa z {stops} przystankami, od {start} do {finish}',
  'The route will appear here once mileage is calculated.':
    'Trasa pojawi się tutaj po obliczeniu przebiegu.',
  'Some stops couldn’t be placed yet.': 'Nie udało się jeszcze zlokalizować części przystanków.',
  'We couldn’t draw part of this route.': 'Nie udało się narysować części tej trasy.',
  '{miles} miles over {legs} legs': '{miles} mil na {legs} odcinkach',
  '{count} of {legs} legs have no road to follow.':
    '{count} z {legs} odcinków nie ma drogi do pokazania.',
  'Carrying a load': 'Z ładunkiem',
  'Route not drawn': 'Trasa nienarysowana',

  // What a day needs a person for, and the one thing to press in each case.
  'Try again': 'Spróbuj ponownie',
  'We couldn’t find this location.': 'Nie udało się znaleźć tej lokalizacji.',
  'Ticket says: {query}': 'Na kwicie: {query}',
  'Possible location: {suggestion}': 'Możliwa lokalizacja: {suggestion}',
  'Use this location': 'Użyj tej lokalizacji',
  'Choose another': 'Wybierz inną',
  'Choose location': 'Wybierz lokalizację',
  'Could not save the location': 'Nie udało się zapisać lokalizacji',
  'We’re not sure which load happened first.': 'Nie wiemy, który ładunek był pierwszy.',
  'Fix order': 'Popraw kolejność',
  'We couldn’t calculate this part of the route: {from} to {to}.':
    'Nie udało się obliczyć tej części trasy: {from} do {to}.',
  'We couldn’t calculate part of this route.': 'Nie udało się obliczyć części tej trasy.',
  'This day has too many tickets to calculate ({n}). Split it or check the dates.':
    'Ten dzień ma za dużo kwitów do obliczenia ({n}). Podziel go albo sprawdź daty.',
  'Open tickets': 'Otwórz kwity',
  'Truck {number} has no average MPG, so fuel can’t be estimated.':
    'Ciężarówka {number} nie ma średniego MPG, więc nie można oszacować paliwa.',
  'Set MPG': 'Ustaw MPG',
  'We couldn’t update mileage right now.': 'Nie udało się teraz zaktualizować przebiegu.',
  'Showing the last good result from {date}.': 'Pokazujemy ostatni poprawny wynik z {date}.',
  'Truck settings have changed since this day was calculated.':
    'Ustawienia ciężarówki zmieniły się od obliczenia tego dnia.',
  'Update this day': 'Zaktualizuj ten dzień',

  // The order of the loads, put right by hand.
  'Put these loads in the order they happened:':
    'Ustaw ładunki w kolejności, w jakiej zostały przewiezione:',
  'Move up': 'W górę',
  'Move down': 'W dół',
  'Move ticket {number} up': 'Przesuń kwit {number} w górę',
  'Move ticket {number} down': 'Przesuń kwit {number} w dół',
  'This order will be remembered unless the tickets change.':
    'Ta kolejność zostanie zapamiętana, dopóki kwity się nie zmienią.',
  'Save this order': 'Zapisz tę kolejność',
  'Order saved': 'Zapisano kolejność',
  'Could not save the order': 'Nie udało się zapisać kolejności',

  // Where a location is, asked once.
  'Where is this?': 'Gdzie to jest?',
  'Type the full address: number and street, city, state.':
    'Wpisz pełny adres: numer i ulica, miasto, stan.',

  // What the server can say back, shown as it is.
  'Invalid request.': 'Nieprawidłowe żądanie.',
  'Mileage routing is not configured on this deployment.':
    'Wyznaczanie tras nie jest skonfigurowane w tym wdrożeniu.',
  'Unknown truck.': 'Nieznana ciężarówka.',
  'No tickets on that day.': 'Brak kwitów w tym dniu.',
  'The stops do not match this day’s tickets.':
    'Przystanki nie zgadzają się z kwitami tego dnia.',

  // IFTA
  'FUEL-TAX REPORTING': 'RAPORTOWANIE PODATKU PALIWOWEGO',
  IFTA: 'IFTA',
  'Quarterly mileage for fuel-tax reporting, from the routes worked out in Mileage.':
    'Kwartalny przebieg do rozliczenia podatku paliwowego, z tras obliczonych w Przebiegu.',
  'Open Mileage': 'Otwórz Przebieg',
  Quarter: 'Kwartał',
  gal: 'gal',
  Days: 'Dni',
  Viewing: 'Wyświetlany',
  '{trucks} without an average MPG: {numbers}. Fuel cannot be estimated for them.':
    'Bez średniego MPG: {trucks} ({numbers}). Nie można dla nich oszacować paliwa.',
  'Estimated miles': 'Szacowane mile',
  '{days} counted': 'Policzone dni: {days}',
  'Estimated fuel used': 'Szacowane zużycie paliwa',
  'At each truck’s average MPG': 'Przy średnim MPG każdej ciężarówki',
  'Tickets on the days counted': 'Kwity z policzonych dni',
  'Trucks with miles this quarter': 'Ciężarówki z milami w tym kwartale',
  'No tickets with a truck and a date in this quarter.':
    'Brak kwitów z ciężarówką i datą w tym kwartale.',
  'Fuel-tax filing': 'Rozliczenie podatku paliwowego',
  'Miles by jurisdiction': 'Mile według jurysdykcji',
  'Jurisdiction mileage is not calculated yet.':
    'Przebieg według jurysdykcji nie jest jeszcze liczony.',
  'Route geometry is stored for every leg, so the miles can be split by state in a later release; until then the quarter is one line.':
    'Geometria trasy jest zapisywana dla każdego odcinka, więc mile będzie można podzielić na stany w kolejnej wersji; do tego czasu kwartał jest jedną pozycją.',
  Jurisdiction: 'Jurysdykcja',
  'All jurisdictions': 'Wszystkie jurysdykcje',
  'Before filing': 'Przed złożeniem',
  'Reporting readiness': 'Gotowość do raportowania',
  'Every truck-day the tickets say this quarter has.':
    'Każdy dzień ciężarówki, jaki wynika z kwitów w tym kwartale.',
  'Days complete': 'Dni gotowe',
  'Days needing review': 'Dni do sprawdzenia',
  'Not calculated yet': 'Jeszcze nieobliczone',
  'Trucks missing a yard': 'Ciężarówki bez bazy',
  'Trucks missing MPG': 'Ciężarówki bez MPG',
  'The order of the loads is uncertain.': 'Kolejność ładunków jest niepewna.',
  'Not calculated yet. Open Mileage to calculate.':
    'Jeszcze nieobliczone. Otwórz Przebieg, aby obliczyć.',
  'Could not calculate this day.': 'Nie udało się obliczyć tego dnia.',
  'Review in Mileage': 'Sprawdź w Przebiegu',
  'and {n} more': 'i jeszcze {n}',
  'Every day in this quarter is calculated.':
    'Każdy dzień w tym kwartale jest obliczony.',
  'By truck': 'Według ciężarówki',
  'No calculated days in this quarter.': 'Brak obliczonych dni w tym kwartale.',
  'To review': 'Do sprawdzenia',
  'Routes follow roads open to each truck’s configured profile as far as TomTom data allows. They are estimates, not legal guidance. Jurisdiction split and filing exports are not available yet.':
    'Trasy prowadzą drogami dostępnymi dla skonfigurowanego profilu ciężarówki, na ile pozwalają dane TomTom. To szacunki, nie porada prawna. Podział na jurysdykcje i eksport do rozliczeń nie są jeszcze dostępne.',

  // Truck Fleet: Mileage & routing
  'Mileage & routing': 'Przebieg i trasy',
  'Yard address': 'Adres bazy',
  'Street, city, state and ZIP the day starts and ends at':
    'Ulica, miasto, stan i kod, gdzie dzień się zaczyna i kończy',
  'Average MPG': 'Średnie MPG',
  'Commercial vehicle': 'Pojazd komercyjny',
  'Used for truck routing restrictions': 'Używane do ograniczeń tras dla ciężarówek',
  'Height ft': 'Wysokość (ft)',
  'Width ft': 'Szerokość (ft)',
  'Length ft': 'Długość (ft)',
  'Gross lb': 'Masa całk. (lb)',
  'Axle lb': 'Nacisk osi (lb)',
  Axles: 'Osie',
  'No yard': 'Brak bazy',
  'Enter the yard for IFTA mileage.': 'Wpisz bazę, aby liczyć przebieg IFTA.',
  'Average MPG must be between 1 and 30, or left empty.':
    'Średnie MPG musi być między 1 a 30 albo pozostać puste.',
  'Axles must be a whole number.': 'Liczba osi musi być całkowita.',
  'The mileage and routing settings are not valid.':
    'Ustawienia przebiegu i tras są nieprawidłowe.',

  // Rates
  // The Rate & Fuel Agent's own page: what each customer has to be asked, what
  // they answered, and what every invoice is priced on.
  RATES: 'STAWKI',
  Rates: 'Stawki',
  'Weekly hauling rates and fuel surcharges: what to ask each customer, what they answered, and what every invoice is priced on.':
    'Tygodniowe stawki za transport i dopłaty paliwowe: o co zapytać każdego klienta, co odpowiedział i na czym wyceniona jest każda faktura.',
  'Your session has ended. Sign in again to see rates.':
    'Sesja wygasła. Zaloguj się ponownie, aby zobaczyć stawki.',
  'The rate agent runs on the server and is not available in the local preview.':
    'Agent stawek działa na serwerze i nie jest dostępny w podglądzie lokalnym.',
  'No reading model is configured, so replies are matched by rules only. Anything the rules cannot place is left for you.':
    'Nie ustawiono modelu do czytania, więc odpowiedzi są dopasowywane tylko regułami. Wszystko, czego reguły nie umieszczą, zostaje dla Ciebie.',
  'Loading rates…': 'Wczytywanie stawek…',
  // The four counters at the top of the page.
  'Waiting for rates': 'Czekają na stawki',
  '{customers} with a request open': '{customers} z otwartą prośbą',
  'Responses received': 'Otrzymane odpowiedzi',
  'Replies read this period': 'Odpowiedzi odczytane w tym okresie',
  'Needs confirmation': 'Wymaga potwierdzenia',
  'Waiting on you': 'Czeka na Ciebie',
  'Nothing waiting on you': 'Nic na Ciebie nie czeka',
  'Ready invoices': 'Gotowe faktury',
  '{invoices} priced in full': '{invoices} wycenione w całości',
  // This week's requests.
  'What to ask': 'O co zapytać',
  'This week’s requests': 'Prośby z tego tygodnia',
  Period: 'Okres',
  'Generate weekly requests': 'Utwórz tygodniowe prośby',
  'Could not write the requests': 'Nie udało się zapisać próśb',
  '{requests} written': 'Zapisano: {requests}',
  '{n} customers skipped: nothing is missing, or there is already a request open.':
    'Pominięto klientów: {n} — nic nie brakuje albo prośba już czeka.',
  'Every customer short a rate this period has a draft.':
    'Każdy klient, któremu w tym okresie brakuje stawki, ma szkic.',
  'No requests for this period yet. Generate them to see what each customer has to be asked.':
    'Brak próśb na ten okres. Utwórz je, aby zobaczyć, o co zapytać każdego klienta.',
  'No requests in this view.': 'Brak próśb w tym widoku.',
  'Pick a request to read it and send it.': 'Wybierz prośbę, aby ją przeczytać i wysłać.',
  'Open the request to {customer}': 'Otwórz prośbę do {customer}',
  'Unknown customer': 'Nieznany klient',
  Jobs: 'Zlecenia',
  'What is asked': 'O co pytamy',
  'Nothing left to ask': 'Nie ma już o co pytać',
  'rate + fuel': 'stawka + paliwo',
  'rate only': 'tylko stawka',
  'fuel surcharge only': 'tylko dopłata paliwowa',
  // Where a request has got to.
  'Waiting for reply': 'Czeka na odpowiedź',
  'Waiting for reply · sent {date}': 'Czeka na odpowiedź · wysłano {date}',
  'Reply received': 'Odpowiedź otrzymana',
  'Reading the reply…': 'Odczytywanie odpowiedzi…',
  '{values} to confirm': '{values} do potwierdzenia',
  'Follow-up due': 'Czas na przypomnienie',
  Resolved: 'Załatwione',
  'Could not be sent': 'Nie udało się wysłać',
  Closed: 'Zamknięta',
  // The selected request: who it goes to and what can be done with it.
  'Selected request': 'Wybrana prośba',
  To: 'Do',
  'No rate contact — add one in Customers': 'Brak kontaktu do stawek — dodaj go w Klientach',
  Send: 'Wyślij',
  'Mark as sent (simulated)': 'Oznacz jako wysłaną (symulacja)',
  'Draft follow-up': 'Szkic przypomnienia',
  'Replies to this request': 'Odpowiedzi na tę prośbę',
  'Confirm below': 'Potwierdź poniżej',
  Simulated: 'Symulowana',
  'Customer email': 'E-mail od klienta',
  'Read by rules': 'Odczytane regułami',
  From: 'Od',
  Subject: 'Temat',
  'No subject': 'Bez tematu',
  Message: 'Wiadomość',
  // Confirming what a reply said.
  'Replies to confirm': 'Odpowiedzi do potwierdzenia',
  'A rate is agreed for a job and a period, so it is confirmed once for every ticket it covers.':
    'Stawkę uzgadnia się dla zlecenia i okresu, więc potwierdza się ją raz dla wszystkich kwitów, które obejmuje.',
  'Nothing is waiting to be confirmed.': 'Nic nie czeka na potwierdzenie.',
  'Nothing could be read out of it.': 'Nic nie dało się z niej odczytać.',
  'Job not named': 'Zlecenie bez nazwy',
  'no figure': 'brak liczby',
  'Not clear from the reply': 'Niejasne z odpowiedzi',
  'Not given': 'Nie podano',
  '{percent}% sure': 'pewność {percent}%',
  'Rate anomaly: {detail}': 'Nietypowa stawka: {detail}',
  Job: 'Zlecenie',
  'Not a job': 'To nie zlecenie',
  'Another job…': 'Inne zlecenie…',
  Value: 'Wartość',
  Unit: 'Jednostka',
  'Confirm for all {tickets}': 'Potwierdź dla wszystkich: {tickets}',
  Reject: 'Odrzuć',
  'Remember these names for this customer': 'Zapamiętaj te nazwy dla tego klienta',
  'The next reply that writes them is matched without asking.':
    'Następna odpowiedź, która ich użyje, zostanie dopasowana bez pytania.',
  'Check the figures': 'Sprawdź liczby',
  '“{value}” is not a number.': '„{value}” nie jest liczbą.',
  'Rates confirmed': 'Stawki potwierdzone',
  '{tickets} repriced.': 'Przeliczono kwitów: {tickets}.',
  'Reject this reply': 'Odrzuć tę odpowiedź',
  'The message stays on file; nothing is priced from it. Say why, so the trail reads.':
    'Wiadomość zostaje w aktach; nic nie jest z niej wyceniane. Napisz dlaczego, żeby ślad był czytelny.',
  'Nothing was changed': 'Nic nie zostało zmienione',
  // Simulating a reply, in development only.
  'Development only': 'Tylko dla wersji roboczej',
  'Simulate a reply': 'Symuluj odpowiedź',
  DEV: 'DEV',
  'Puts a message through the reader exactly as an arriving email would go through it. Nothing is emailed.':
    'Przepuszcza wiadomość przez czytnik dokładnie tak jak przychodzący e-mail. Nic nie jest wysyłane.',
  'Pick a customer': 'Wybierz klienta',
  'In reply to': 'W odpowiedzi na',
  'No request': 'Bez prośby',
  'Markham Road is $8.75 a ton, fuel 12%.': 'Markham Road to $8.75 za tonę, paliwo 12%.',
  'Process reply': 'Przetwórz odpowiedź',
  'The reply was not read': 'Odpowiedź nie została odczytana',
  'Reply processed': 'Odpowiedź przetworzona',
  '{applied} applied, {pending} waiting to be confirmed.':
    'Zastosowano: {applied}, czeka na potwierdzenie: {pending}.',
  // The rates on file, and what the tickets were priced on.
  'What invoices are priced on': 'Na czym wyceniane są faktury',
  'Rate history': 'Historia stawek',
  'Show history': 'Pokaż historię',
  'Re-price tickets': 'Przelicz kwity',
  'Nothing was repriced': 'Nic nie zostało przeliczone',
  'Tickets repriced': 'Kwity przeliczone',
  '{tickets} changed, {conflicts} could not be.':
    'Zmieniono: {tickets}, nie udało się: {conflicts}.',
  'No rates on file yet.': 'Brak zapisanych stawek.',
  Kind: 'Rodzaj',
  Base: 'Podstawa',
  Effective: 'Obowiązuje',
  Source: 'Źródło',
  Confidence: 'Pewność',
  'Applied by': 'Zastosował',
  '{date} · for the project': '{date} · na cały projekt',
  open: 'otwarte',
  '{percent}%': '{percent}%',
  'Applied automatically': 'Zastosowano automatycznie',
  'Confirmed by {who}': 'Potwierdzone przez: {who}',
  'a person': 'osobę',
  // Adding a rate by hand.
  'Add rate': 'Dodaj stawkę',
  'The figure in force from a day. Whatever it replaces is kept, so older invoices still read.':
    'Liczba obowiązująca od danego dnia. To, co zastępuje, zostaje zachowane, więc starsze faktury nadal się czytają.',
  'Pick a job': 'Wybierz zlecenie',
  'Job name': 'Nazwa zlecenia',
  'In force from': 'Obowiązuje od',
  Until: 'Do dnia',
  'Applies for the rest of the project': 'Obowiązuje do końca projektu',
  'The figure holds until a later one replaces it.':
    'Liczba obowiązuje, dopóki nie zastąpi jej późniejsza.',
  Why: 'Dlaczego',
  'Agreed on the phone with the yard': 'Uzgodnione telefonicznie z bazą',
  'Save rate': 'Zapisz stawkę',
  'Rate saved': 'Stawka zapisana',
  // The invoices this is all for.
  'Before they can go out': 'Zanim będą mogły pójść',
  'Invoices waiting on rates': 'Faktury czekające na stawki',
  'Open Invoices & Tickets': 'Otwórz Faktury i kwity',
  'No invoice is waiting on a rate.': 'Żadna faktura nie czeka na stawkę.',
  'Draft invoice': 'Szkic faktury',
  undated: 'bez daty',
  'Waiting on {jobs}': 'Czeka na: {jobs}',
  'Finalized {date} · {total}': 'Zatwierdzona {date} · {total}',
  'Rate change after finalizing: {detail}': 'Zmiana stawki po zatwierdzeniu: {detail}',
  // The trail.
  'What the agent did': 'Co zrobił agent',
  'Recent activity': 'Ostatnie działania',
  'Nothing has happened yet.': 'Jeszcze nic się nie wydarzyło.',
  Agent: 'Agent',
  'A rate is never edited in place: a new figure supersedes the old one and the old one stays on file, so an invoice can always be explained by the rate that was in force when it was printed.':
    'Stawki nigdy nie zmienia się w miejscu: nowa liczba zastępuje starą, a stara zostaje w aktach, więc każdą fakturę da się wyjaśnić stawką, która obowiązywała w chwili jej wydruku.',

  // Customers: rates & requests
  'Rates & requests': 'Stawki i prośby',
  'Who to ask for rates': 'Kogo pytać o stawki',
  'No rate contact': 'Brak kontaktu do stawek',
  'No rate contact yet.': 'Brak kontaktu do stawek.',
  'Add a contact so the agent can ask this customer for rates.':
    'Dodaj kontakt, aby agent mógł zapytać tego klienta o stawki.',
  'Add contact': 'Dodaj kontakt',
  Primary: 'Główny',
  'Remove contact {number}': 'Usuń kontakt {number}',
  'Anything to remember when writing to them': 'Co pamiętać, pisząc do nich',
  'Follow up after (days)': 'Przypomnij po (dni)',
  'Send mode': 'Tryb wysyłki',
  'Drafts only on this deployment': 'W tym wdrożeniu tylko szkice',
  'Auto-create weekly request': 'Twórz tygodniową prośbę automatycznie',
  'Drafted when a job of theirs is short a rate':
    'Szkic powstaje, gdy ich zleceniu brakuje stawki',
  'Names this customer uses for its jobs': 'Nazwy, których ten klient używa dla swoich zleceń',
  'Add a delivery address': 'Dodaj adres dostawy',
  'Street, city, state': 'Ulica, miasto, stan',
  'No addresses yet.': 'Brak adresów.',
  'Seen on this customer’s tickets': 'Widziane na kwitach tego klienta',

  // Invoices: readiness
  // The chips on an invoice that say what it is still waiting for, and the
  // two buttons that settle its pricing.
  Ready: 'Gotowa',
  'Waiting for rate': 'Czeka na stawkę',
  'Waiting for fuel': 'Czeka na paliwo',
  'Base rate': 'Stawka podstawowa',
  Finalized: 'Zatwierdzona',
  'Finalized {date}': 'Zatwierdzona {date}',
  Finalize: 'Zatwierdź',
  'Finalize {name}?': 'Zatwierdzić {name}?',
  'Lock this invoice’s pricing? Later rate changes will not alter it.':
    'Zablokować wycenę tej faktury? Późniejsze zmiany stawek jej nie zmienią.',
  'Could not finalize': 'Nie udało się zatwierdzić',
  'Finalized {name}': 'Zatwierdzono {name}',
  'Its pricing is kept as it is now. Later rate changes do not alter it.':
    'Jej wycena zostaje taka, jaka jest teraz. Późniejsze zmiany stawek jej nie zmienią.',
  Unlock: 'Odblokuj',
  'Unlock {name}?': 'Odblokować {name}?',
  'The invoice is priced from the rates on file again. Say why it was reopened; the reason is kept with the invoice.':
    'Faktura znów jest wyceniana według stawek z akt. Napisz, dlaczego została otwarta; powód zostaje przy fakturze.',
  Reason: 'Powód',
  'The customer corrected the fuel surcharge': 'Klient poprawił dopłatę paliwową',
  'Could not unlock': 'Nie udało się odblokować',
  'Unlocked {name}': 'Odblokowano {name}',
  'It is priced from the rates on file again.': 'Jest znów wyceniana według stawek z akt.',
  Filters: 'Filtry',
  'Hide filters': 'Ukryj filtry',
  // What the server says back when a request or a reply cannot go through.
  'Requests are drafts only on this deployment; nothing is emailed.':
    'W tym wdrożeniu prośby są tylko szkicami; nic nie jest wysyłane e-mailem.',
  'No email service is connected yet.': 'Nie podłączono jeszcze żadnej usługi e-mail.',
  'This reply was already processed.': 'Ta odpowiedź została już przetworzona.',
  'Rate requests are turned off for this customer.':
    'Prośby o stawki są wyłączone dla tego klienta.',
  'A request for this period already exists.': 'Prośba na ten okres już istnieje.',
  'The ticket pricing details are not valid.': 'Szczegóły wyceny kwitu są nieprawidłowe.',
};
