import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend cross-origin requests
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  // Enable global DTO validation checking
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  // Configure Swagger OpenAPI specification
  const config = new DocumentBuilder()
    .setTitle("CarbonCoach AI — Production REST API Spec")
    .setDescription("The complete API specifications document for CarbonCoach AI footprint awareness platform, tracking systems, vision cameras, and gamified community modules.")
    .setVersion("1.0.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  const port = process.env.PORT || 4000; // backend runs on 4000 to avoid conflicting with frontend 3000
  await app.listen(port);
  console.log(`🚀 CarbonCoach AI backend compiling & running on http://localhost:${port}`);
  console.log(`📖 Swagger API documentation available at http://localhost:${port}/api`);
}
bootstrap();
