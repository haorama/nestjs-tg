# Nestjs Typegoose
Typegoose module for nestjs

This package are still in development and does not ready for production

## Installation
```bash
npm install mongoose @typegoose/typegoose @haorama/nestjs-tg

# OR
yarn add mongoose @typegoose/typegoose @haorama/nestjs-tg
```

## Usage
```typescript
import { Module } from "@nestjs/common";
import { TypegooseModule } from "@haorama/nestjs-tg";

@Module({
  imports: [
    TypegooseModule.forRoot(
      "mongodb://root:password@localhost:27017/test",
    ),
  ],
})
export class AppModule {}
```

## Todos
- Test using different / custom connectionName
- Discriminators
- forRootAsync / forFeatureAsync
