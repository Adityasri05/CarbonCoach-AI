"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('CarbonCoach AI — Production REST API Spec')
        .setDescription('The complete API specifications document for CarbonCoach AI footprint awareness platform, tracking systems, vision cameras, and gamified community modules.')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`🚀 CarbonCoach AI backend compiling & running on http://localhost:${port}`);
    console.log(`📖 Swagger API documentation available at http://localhost:${port}/api`);
}
void bootstrap();
//# sourceMappingURL=main.js.map