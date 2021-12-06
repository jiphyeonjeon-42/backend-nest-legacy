import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AirtableService } from './airtable/airtable.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const airtableService = app.get<AirtableService>(AirtableService);

  const books = await airtableService.getAirtableBooks();
  console.log(`${books.length} books are fetched from airtable`);
  await airtableService.migrateAirtablebooks(books);
  console.log(`compelete!`);
  await app.close();
}
bootstrap();
