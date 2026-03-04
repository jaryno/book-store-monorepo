import { config } from 'dotenv';
config();

import { PrismaClient, Language, Binding, BookCondition, CopyStatus } from '../src/generated/client/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env['DATABASE_URL'] as string,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  await prisma.bookItem.deleteMany();
  await prisma.authorsOnBookEditions.deleteMany();
  await prisma.bookEdition.deleteMany();
  await prisma.book.deleteMany();
  await prisma.author.deleteMany();
  await prisma.publisher.deleteMany();

  const publishers = await Promise.all([
    prisma.publisher.create({ data: { name: 'Host' } }),
    prisma.publisher.create({ data: { name: 'Odeon' } }),
    prisma.publisher.create({ data: { name: 'Argo' } }),
    prisma.publisher.create({ data: { name: 'Albatros' } }),
    prisma.publisher.create({ data: { name: 'Euromedia Group' } }),
    prisma.publisher.create({ data: { name: 'Paseka' } }),
    prisma.publisher.create({ data: { name: 'Atlantis' } }),
    prisma.publisher.create({ data: { name: 'Faber and Faber' } }),
    prisma.publisher.create({ data: { name: 'Penguin Books' } }),
    prisma.publisher.create({ data: { name: 'Leda' } }),
  ]);

  const pubMap = Object.fromEntries(publishers.map((p) => [p.name, p]));

  const authors = await Promise.all([
    prisma.author.create({ data: { name: 'Milan Kundera', slug: 'milan-kundera' } }),
    prisma.author.create({ data: { name: 'Michal Viewegh', slug: 'michal-viewegh' } }),
    prisma.author.create({ data: { name: 'Andrzej Sapkowski', slug: 'andrzej-sapkowski' } }),
    prisma.author.create({ data: { name: 'Bohumil Hrabal', slug: 'bohumil-hrabal' } }),
    prisma.author.create({ data: { name: 'Karel Čapek', slug: 'karel-capek' } }),
    prisma.author.create({ data: { name: 'Jaroslav Hašek', slug: 'jaroslav-hasek' } }),
    prisma.author.create({ data: { name: 'Agatha Christie', slug: 'agatha-christie' } }),
    prisma.author.create({ data: { name: 'Franz Kafka', slug: 'franz-kafka' } }),
    prisma.author.create({ data: { name: 'Gabriel García Márquez', slug: 'gabriel-garcia-marquez' } }),
    prisma.author.create({ data: { name: 'George Orwell', slug: 'george-orwell' } }),
    prisma.author.create({ data: { name: 'Fiodor Dostojevský', slug: 'fiodor-dostojevsky' } }),
    prisma.author.create({ data: { name: 'Leo Tolstoj', slug: 'leo-tolstoj' } }),
    prisma.author.create({ data: { name: 'Umberto Eco', slug: 'umberto-eco' } }),
    prisma.author.create({ data: { name: 'Antoine de Saint-Exupéry', slug: 'antoine-de-saint-exupery' } }),
    prisma.author.create({ data: { name: 'J.R.R. Tolkien', slug: 'jrr-tolkien' } }),
  ]);

  const authorMap = Object.fromEntries(authors.map((a) => [a.slug, a]));

  const kunderaBook = await prisma.book.create({
    data: { slug: 'nesnesitelna-lehkost-byti', name: 'Nesnesitelná lehkost bytí', description: 'Filozofický román Milana Kundery z roku 1984, zasazený do doby pražského jara 1968.' },
  });
  const kunderaEditionCS = await prisma.bookEdition.create({
    data: { bookId: kunderaBook.id, publisherId: pubMap['Atlantis'].id, language: Language.CS, binding: Binding.SOFT, yearPublished: 2006, pageCount: 312, readingTimeMinutes: 780, isbn: '978-80-7108-289-7', authors: { create: [{ authorId: authorMap['milan-kundera'].id }] } },
  });
  const kunderaEditionEN = await prisma.bookEdition.create({
    data: { bookId: kunderaBook.id, publisherId: pubMap['Faber and Faber'].id, language: Language.EN, binding: Binding.SOFT, yearPublished: 1999, pageCount: 320, readingTimeMinutes: 800, isbn: '978-0-571-13521-0', authors: { create: [{ authorId: authorMap['milan-kundera'].id }] } },
  });
  await prisma.bookItem.createMany({ data: [
    { bookEditionId: kunderaEditionCS.id, condition: BookCondition.VERY_GOOD, price: 159, status: CopyStatus.AVAILABLE },
    { bookEditionId: kunderaEditionCS.id, condition: BookCondition.GOOD,      price: 119, status: CopyStatus.AVAILABLE },
    { bookEditionId: kunderaEditionCS.id, condition: BookCondition.GOOD,      price: 109, status: CopyStatus.SOLD },
    { bookEditionId: kunderaEditionCS.id, condition: BookCondition.DAMAGED,   price:  69, status: CopyStatus.AVAILABLE },
    { bookEditionId: kunderaEditionEN.id, condition: BookCondition.VERY_GOOD, price: 189, status: CopyStatus.AVAILABLE },
    { bookEditionId: kunderaEditionEN.id, condition: BookCondition.GOOD,      price: 149, status: CopyStatus.SOLD },
  ]});

  const vieweghBook = await prisma.book.create({
    data: { slug: 'vychova-divek-v-cechach', name: 'Výchova dívek v Čechách', description: 'Humoristický román Michala Viewegha z roku 1994 o mladém soukromém učiteli.' },
  });
  const vieweghEditionCS = await prisma.bookEdition.create({
    data: { bookId: vieweghBook.id, publisherId: pubMap['Atlantis'].id, language: Language.CS, binding: Binding.SOFT, yearPublished: 2000, pageCount: 183, readingTimeMinutes: 458, isbn: '978-80-7108-208-8', authors: { create: [{ authorId: authorMap['michal-viewegh'].id }] } },
  });
  await prisma.bookItem.createMany({ data: [
    { bookEditionId: vieweghEditionCS.id, condition: BookCondition.VERY_GOOD, price: 129, status: CopyStatus.AVAILABLE },
    { bookEditionId: vieweghEditionCS.id, condition: BookCondition.GOOD,      price:  99, status: CopyStatus.AVAILABLE },
    { bookEditionId: vieweghEditionCS.id, condition: BookCondition.DAMAGED,   price:  59, status: CopyStatus.AVAILABLE },
  ]});

  const zakladacBook = await prisma.book.create({
    data: { slug: 'zaklinar-posledni-prani', name: 'Zaklínač: Poslední přání', description: 'První kniha ságy o Zaklínači. Sbírka povídek představující Geralta z Rivie.' },
  });
  const zakladacEditionCS = await prisma.bookEdition.create({
    data: { bookId: zakladacBook.id, publisherId: pubMap['Argo'].id, language: Language.CS, binding: Binding.SOFT, yearPublished: 2016, pageCount: 288, readingTimeMinutes: 720, isbn: '978-80-257-1570-5', authors: { create: [{ authorId: authorMap['andrzej-sapkowski'].id }] } },
  });
  const zakladacEditionPL = await prisma.bookEdition.create({
    data: { bookId: zakladacBook.id, publisherId: pubMap['Argo'].id, language: Language.PL, binding: Binding.HARD, yearPublished: 2014, pageCount: 292, readingTimeMinutes: 730, isbn: '978-83-7469-293-8', authors: { create: [{ authorId: authorMap['andrzej-sapkowski'].id }] } },
  });
  await prisma.bookItem.createMany({ data: [
    { bookEditionId: zakladacEditionCS.id, condition: BookCondition.VERY_GOOD, price: 179, status: CopyStatus.AVAILABLE },
    { bookEditionId: zakladacEditionCS.id, condition: BookCondition.VERY_GOOD, price: 179, status: CopyStatus.RESERVED },
    { bookEditionId: zakladacEditionCS.id, condition: BookCondition.GOOD,      price: 139, status: CopyStatus.AVAILABLE },
    { bookEditionId: zakladacEditionCS.id, condition: BookCondition.DAMAGED,   price:  79, status: CopyStatus.AVAILABLE },
    { bookEditionId: zakladacEditionPL.id, condition: BookCondition.VERY_GOOD, price: 149, status: CopyStatus.AVAILABLE },
    { bookEditionId: zakladacEditionPL.id, condition: BookCondition.GOOD,      price: 119, status: CopyStatus.SOLD },
  ]});

  const hrabalBook = await prisma.book.create({
    data: { slug: 'ostre-sledovane-vlaky', name: 'Ostře sledované vlaky', description: 'Novela Bohumila Hrabala z roku 1965, jeden z nejvýznamnějších děl české prózy.' },
  });
  const hrabalEditionCS1 = await prisma.bookEdition.create({
    data: { bookId: hrabalBook.id, publisherId: pubMap['Odeon'].id, language: Language.CS, binding: Binding.HARD, yearPublished: 1990, pageCount: 84, readingTimeMinutes: 210, isbn: '978-80-207-0143-6', authors: { create: [{ authorId: authorMap['bohumil-hrabal'].id }] } },
  });
  const hrabalEditionCS2 = await prisma.bookEdition.create({
    data: { bookId: hrabalBook.id, publisherId: pubMap['Euromedia Group'].id, language: Language.CS, binding: Binding.SOFT, yearPublished: 2012, pageCount: 96, readingTimeMinutes: 240, isbn: '978-80-242-3298-1', authors: { create: [{ authorId: authorMap['bohumil-hrabal'].id }] } },
  });
  await prisma.bookItem.createMany({ data: [
    { bookEditionId: hrabalEditionCS1.id, condition: BookCondition.GOOD,      price: 109, status: CopyStatus.AVAILABLE },
    { bookEditionId: hrabalEditionCS1.id, condition: BookCondition.DAMAGED,   price:  59, status: CopyStatus.AVAILABLE },
    { bookEditionId: hrabalEditionCS2.id, condition: BookCondition.VERY_GOOD, price: 139, status: CopyStatus.AVAILABLE },
    { bookEditionId: hrabalEditionCS2.id, condition: BookCondition.GOOD,      price:  99, status: CopyStatus.AVAILABLE },
  ]});

  const capekBook = await prisma.book.create({
    data: { slug: 'rur', name: 'R.U.R.', description: 'Drama Karla Čapka z roku 1920, ve kterém autor poprvé použil slovo robot.' },
  });
  const capekEditionCS = await prisma.bookEdition.create({
    data: { bookId: capekBook.id, publisherId: pubMap['Argo'].id, language: Language.CS, binding: Binding.SOFT, yearPublished: 2004, pageCount: 96, readingTimeMinutes: 240, isbn: '978-80-720-3571-2', authors: { create: [{ authorId: authorMap['karel-capek'].id }] } },
  });
  const capekEditionDE = await prisma.bookEdition.create({
    data: { bookId: capekBook.id, publisherId: pubMap['Host'].id, language: Language.DE, binding: Binding.SOFT, yearPublished: 2015, pageCount: 112, readingTimeMinutes: 280, authors: { create: [{ authorId: authorMap['karel-capek'].id }] } },
  });
  await prisma.bookItem.createMany({ data: [
    { bookEditionId: capekEditionCS.id, condition: BookCondition.VERY_GOOD, price: 119, status: CopyStatus.AVAILABLE },
    { bookEditionId: capekEditionCS.id, condition: BookCondition.GOOD,      price:  89, status: CopyStatus.AVAILABLE },
    { bookEditionId: capekEditionDE.id, condition: BookCondition.VERY_GOOD, price: 149, status: CopyStatus.AVAILABLE },
  ]});

  const hasekBook = await prisma.book.create({
    data: { slug: 'osudy-dobreho-vojaka-svejka', name: 'Osudy dobrého vojáka Švejka', description: 'Satirický román Jaroslava Haška – jeden z nejvýznamnějších děl světové literatury.' },
  });
  const hasekEditionCS = await prisma.bookEdition.create({
    data: { bookId: hasekBook.id, publisherId: pubMap['Euromedia Group'].id, language: Language.CS, binding: Binding.HARD, yearPublished: 2008, pageCount: 752, readingTimeMinutes: 1880, isbn: '978-80-242-2016-2', authors: { create: [{ authorId: authorMap['jaroslav-hasek'].id }] } },
  });
  const hasekEditionDE = await prisma.bookEdition.create({
    data: { bookId: hasekBook.id, publisherId: pubMap['Argo'].id, language: Language.DE, binding: Binding.SOFT, yearPublished: 2011, pageCount: 784, readingTimeMinutes: 1960, authors: { create: [{ authorId: authorMap['jaroslav-hasek'].id }] } },
  });
  await prisma.bookItem.createMany({ data: [
    { bookEditionId: hasekEditionCS.id, condition: BookCondition.VERY_GOOD, price: 249, status: CopyStatus.AVAILABLE },
    { bookEditionId: hasekEditionCS.id, condition: BookCondition.GOOD,      price: 189, status: CopyStatus.AVAILABLE },
    { bookEditionId: hasekEditionCS.id, condition: BookCondition.DAMAGED,   price:  99, status: CopyStatus.AVAILABLE },
    { bookEditionId: hasekEditionDE.id, condition: BookCondition.VERY_GOOD, price: 229, status: CopyStatus.AVAILABLE },
    { bookEditionId: hasekEditionDE.id, condition: BookCondition.GOOD,      price: 179, status: CopyStatus.SOLD },
  ]});

  const christieBook = await prisma.book.create({
    data: { slug: 'vrazda-rogera-ackroyda', name: 'Vražda Rogera Ackroyda', description: 'Jeden z nejslavnějších detektivních románů všech dob od Agathy Christie.' },
  });
  const christieEditionCS = await prisma.bookEdition.create({
    data: { bookId: christieBook.id, publisherId: pubMap['Euromedia Group'].id, language: Language.CS, binding: Binding.SOFT, yearPublished: 2019, pageCount: 224, readingTimeMinutes: 560, isbn: '978-80-242-6299-5', authors: { create: [{ authorId: authorMap['agatha-christie'].id }] } },
  });
  await prisma.bookItem.createMany({ data: [
    { bookEditionId: christieEditionCS.id, condition: BookCondition.VERY_GOOD, price: 169, status: CopyStatus.SOLD },
    { bookEditionId: christieEditionCS.id, condition: BookCondition.GOOD,      price: 129, status: CopyStatus.SOLD },
    { bookEditionId: christieEditionCS.id, condition: BookCondition.DAMAGED,   price:  79, status: CopyStatus.SOLD },
  ]});

  const kafkaBook = await prisma.book.create({
    data: { slug: 'proces', name: 'Proces', description: 'Kafkův existenciální román o Josefu K., který je souzen bez znalosti obvinění.' },
  });
  const kafkaEditionCS = await prisma.bookEdition.create({
    data: { bookId: kafkaBook.id, publisherId: pubMap['Argo'].id, language: Language.CS, binding: Binding.SOFT, yearPublished: 2010, pageCount: 168, readingTimeMinutes: 420, isbn: '978-80-257-0286-6', authors: { create: [{ authorId: authorMap['franz-kafka'].id }] } },
  });
  const kafkaEditionDE = await prisma.bookEdition.create({
    data: { bookId: kafkaBook.id, publisherId: pubMap['Host'].id, language: Language.DE, binding: Binding.SOFT, yearPublished: 2008, pageCount: 192, readingTimeMinutes: 480, authors: { create: [{ authorId: authorMap['franz-kafka'].id }] } },
  });
  await prisma.bookItem.createMany({ data: [
    { bookEditionId: kafkaEditionCS.id, condition: BookCondition.VERY_GOOD, price: 139, status: CopyStatus.AVAILABLE },
    { bookEditionId: kafkaEditionCS.id, condition: BookCondition.GOOD,      price:  99, status: CopyStatus.AVAILABLE },
    { bookEditionId: kafkaEditionDE.id, condition: BookCondition.VERY_GOOD, price: 159, status: CopyStatus.AVAILABLE },
  ]});

  const marquezBook = await prisma.book.create({
    data: { slug: 'sto-roku-samoty', name: 'Sto roků samoty', description: 'Magický realismus Garcíi Márqueze. Epický příběh rodu Buendíových v Macondo.' },
  });
  const marquezEditionCS = await prisma.bookEdition.create({
    data: { bookId: marquezBook.id, publisherId: pubMap['Odeon'].id, language: Language.CS, binding: Binding.SOFT, yearPublished: 2015, pageCount: 384, readingTimeMinutes: 960, isbn: '978-80-207-1774-1', authors: { create: [{ authorId: authorMap['gabriel-garcia-marquez'].id }] } },
  });
  await prisma.bookItem.createMany({ data: [
    { bookEditionId: marquezEditionCS.id, condition: BookCondition.VERY_GOOD, price: 199, status: CopyStatus.AVAILABLE },
    { bookEditionId: marquezEditionCS.id, condition: BookCondition.GOOD,      price: 149, status: CopyStatus.AVAILABLE },
    { bookEditionId: marquezEditionCS.id, condition: BookCondition.DAMAGED,   price:  89, status: CopyStatus.AVAILABLE },
  ]});

  const orwellBook = await prisma.book.create({
    data: { slug: 'farma-zvirat', name: 'Farma zvířat', description: 'Satirická alegorie George Orwella na totalitní režimy prostřednictvím příběhu farmy.' },
  });
  const orwellEditionCS = await prisma.bookEdition.create({
    data: { bookId: orwellBook.id, publisherId: pubMap['Paseka'].id, language: Language.CS, binding: Binding.SOFT, yearPublished: 2009, pageCount: 128, readingTimeMinutes: 320, isbn: '978-80-7185-962-5', authors: { create: [{ authorId: authorMap['george-orwell'].id }] } },
  });
  const orwellEditionEN = await prisma.bookEdition.create({
    data: { bookId: orwellBook.id, publisherId: pubMap['Penguin Books'].id, language: Language.EN, binding: Binding.SOFT, yearPublished: 2000, pageCount: 112, readingTimeMinutes: 280, isbn: '978-0-14-118776-1', authors: { create: [{ authorId: authorMap['george-orwell'].id }] } },
  });
  await prisma.bookItem.createMany({ data: [
    { bookEditionId: orwellEditionCS.id, condition: BookCondition.VERY_GOOD, price: 129, status: CopyStatus.AVAILABLE },
    { bookEditionId: orwellEditionCS.id, condition: BookCondition.GOOD,      price:  89, status: CopyStatus.SOLD },
    { bookEditionId: orwellEditionEN.id, condition: BookCondition.VERY_GOOD, price: 149, status: CopyStatus.AVAILABLE },
  ]});

  const dostojevskyBook = await prisma.book.create({
    data: { slug: 'zlocin-a-trest', name: 'Zločin a trest', description: 'Psychologický román Dostojevského o studentovi Raskolnikovovi, který spáchá vraždu.' },
  });
  const dostojevskyEditionCS = await prisma.bookEdition.create({
    data: { bookId: dostojevskyBook.id, publisherId: pubMap['Odeon'].id, language: Language.CS, binding: Binding.HARD, yearPublished: 2004, pageCount: 584, readingTimeMinutes: 1460, isbn: '978-80-207-1129-9', authors: { create: [{ authorId: authorMap['fiodor-dostojevsky'].id }] } },
  });
  await prisma.bookItem.createMany({ data: [
    { bookEditionId: dostojevskyEditionCS.id, condition: BookCondition.VERY_GOOD, price: 279, status: CopyStatus.AVAILABLE },
    { bookEditionId: dostojevskyEditionCS.id, condition: BookCondition.GOOD,      price: 199, status: CopyStatus.AVAILABLE },
    { bookEditionId: dostojevskyEditionCS.id, condition: BookCondition.DAMAGED,   price:  99, status: CopyStatus.AVAILABLE },
  ]});

  const tolstojBook = await prisma.book.create({
    data: { slug: 'anna-kareninova', name: 'Anna Kareninová', description: 'Román Lva Tolstoje o tragické lásce aristokratky v carském Rusku.' },
  });
  const tolstojEditionCS = await prisma.bookEdition.create({
    data: { bookId: tolstojBook.id, publisherId: pubMap['Leda'].id, language: Language.CS, binding: Binding.HARD, yearPublished: 2012, pageCount: 864, readingTimeMinutes: 2160, isbn: '978-80-7335-316-5', authors: { create: [{ authorId: authorMap['leo-tolstoj'].id }] } },
  });
  await prisma.bookItem.createMany({ data: [
    { bookEditionId: tolstojEditionCS.id, condition: BookCondition.VERY_GOOD, price: 299, status: CopyStatus.AVAILABLE },
    { bookEditionId: tolstojEditionCS.id, condition: BookCondition.GOOD,      price: 229, status: CopyStatus.SOLD },
  ]});

  const ecoBook = await prisma.book.create({
    data: { slug: 'jmeno-ruze', name: 'Jméno růže', description: 'Středověká detektivní romance Umberta Eca v italském benediktinském klášteře.' },
  });
  const ecoEditionCS = await prisma.bookEdition.create({
    data: { bookId: ecoBook.id, publisherId: pubMap['Argo'].id, language: Language.CS, binding: Binding.SOFT, yearPublished: 2013, pageCount: 528, readingTimeMinutes: 1320, isbn: '978-80-257-0951-3', authors: { create: [{ authorId: authorMap['umberto-eco'].id }] } },
  });
  await prisma.bookItem.createMany({ data: [
    { bookEditionId: ecoEditionCS.id, condition: BookCondition.VERY_GOOD, price: 219, status: CopyStatus.AVAILABLE },
    { bookEditionId: ecoEditionCS.id, condition: BookCondition.GOOD,      price: 169, status: CopyStatus.AVAILABLE },
    { bookEditionId: ecoEditionCS.id, condition: BookCondition.DAMAGED,   price:  99, status: CopyStatus.AVAILABLE },
  ]});

  const exuperyBook = await prisma.book.create({
    data: { slug: 'maly-princ', name: 'Malý princ', description: 'Poetická pohádka Antoine de Saint-Exupéryho o malém princi cestujícím vesmírem.' },
  });
  const exuperyEditionCS = await prisma.bookEdition.create({
    data: { bookId: exuperyBook.id, publisherId: pubMap['Albatros'].id, language: Language.CS, binding: Binding.HARD, yearPublished: 2018, pageCount: 96, readingTimeMinutes: 240, isbn: '978-80-00-05200-8', authors: { create: [{ authorId: authorMap['antoine-de-saint-exupery'].id }] } },
  });
  const exuperyEditionFR = await prisma.bookEdition.create({
    data: { bookId: exuperyBook.id, publisherId: pubMap['Leda'].id, language: Language.FR, binding: Binding.SOFT, yearPublished: 2015, pageCount: 104, readingTimeMinutes: 260, authors: { create: [{ authorId: authorMap['antoine-de-saint-exupery'].id }] } },
  });
  await prisma.bookItem.createMany({ data: [
    { bookEditionId: exuperyEditionCS.id, condition: BookCondition.VERY_GOOD, price: 149, status: CopyStatus.AVAILABLE },
    { bookEditionId: exuperyEditionCS.id, condition: BookCondition.GOOD,      price: 109, status: CopyStatus.AVAILABLE },
    { bookEditionId: exuperyEditionFR.id, condition: BookCondition.VERY_GOOD, price: 169, status: CopyStatus.AVAILABLE },
  ]});

  const tolkienBook = await prisma.book.create({
    data: { slug: 'pan-prstenu-spolecenstvo', name: 'Pán prstenů: Společenstvo prstenu', description: 'První díl epické fantasy trilogie J.R.R. Tolkiena o cestě k zničení Jednoho prstenu.' },
  });
  const tolkienEditionCS = await prisma.bookEdition.create({
    data: { bookId: tolkienBook.id, publisherId: pubMap['Argo'].id, language: Language.CS, binding: Binding.HARD, yearPublished: 2012, pageCount: 560, readingTimeMinutes: 1400, isbn: '978-80-257-0602-4', authors: { create: [{ authorId: authorMap['jrr-tolkien'].id }] } },
  });
  const tolkienEditionEN = await prisma.bookEdition.create({
    data: { bookId: tolkienBook.id, publisherId: pubMap['Faber and Faber'].id, language: Language.EN, binding: Binding.HARD, yearPublished: 2004, pageCount: 576, readingTimeMinutes: 1440, isbn: '978-0-261-10235-4', authors: { create: [{ authorId: authorMap['jrr-tolkien'].id }] } },
  });
  await prisma.bookItem.createMany({ data: [
    { bookEditionId: tolkienEditionCS.id, condition: BookCondition.VERY_GOOD, price: 349, status: CopyStatus.AVAILABLE },
    { bookEditionId: tolkienEditionCS.id, condition: BookCondition.GOOD,      price: 269, status: CopyStatus.AVAILABLE },
    { bookEditionId: tolkienEditionCS.id, condition: BookCondition.DAMAGED,   price: 149, status: CopyStatus.AVAILABLE },
    { bookEditionId: tolkienEditionEN.id, condition: BookCondition.VERY_GOOD, price: 389, status: CopyStatus.AVAILABLE },
    { bookEditionId: tolkienEditionEN.id, condition: BookCondition.GOOD,      price: 299, status: CopyStatus.SOLD },
  ]});

  const bookCount = await prisma.book.count();
  const editionCount = await prisma.bookEdition.count();
  const itemCount = await prisma.bookItem.count();
  const availableCount = await prisma.bookItem.count({ where: { status: CopyStatus.AVAILABLE } });

  console.log(`Seed complete:`);
  console.log(`  Books:        ${bookCount}`);
  console.log(`  BookEditions: ${editionCount}`);
  console.log(`  BookItems:    ${itemCount} total, ${availableCount} available`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

