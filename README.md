# Nestjs Typegoose
Typegoose module for nestjs

it used almost same behavior as @nestjs/mongoose

## Installation
```bash
npm install mongoose @typegoose/typegoose @haorama/nestjs-tg

yarn add mongoose @typegoose/typegoose @haorama/nestjs-tg

pnpm add mongoose @typegoose/typegoose @haorama/nestjs-tg
```

## Usage
```typescript
import { Module } from "@nestjs/common";
import { TypegooseModule } from "@haorama/nestjs-tg";

@Module({
  imports: [
    TypegooseModule.forRoot(
      "mongodb://localhost:27017/test",
    ),
  ],
})
export class AppModule {}
```

## Todos
- Test using different / custom connectionName
