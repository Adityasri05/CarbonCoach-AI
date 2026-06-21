"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengesController = void 0;
const common_1 = require("@nestjs/common");
const challenges_service_1 = require("./challenges.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let ChallengesController = class ChallengesController {
    challengesService;
    constructor(challengesService) {
        this.challengesService = challengesService;
    }
    async getChallenges(req) {
        return this.challengesService.getChallenges(req.user.id);
    }
    async joinChallenge(req, body) {
        return this.challengesService.joinChallenge(req.user.id, body.challengeId);
    }
    async logProgress(req, body) {
        return this.challengesService.logProgress(req.user.id, body.challengeId, body.daysCompleted || 1);
    }
};
exports.ChallengesController = ChallengesController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List all active eco challenges and user status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully fetched challenges' }),
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChallengesController.prototype, "getChallenges", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Join a weekly sustainability challenge' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Successfully joined challenge' }),
    (0, common_1.Post)('join'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChallengesController.prototype, "joinChallenge", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Log days progress towards a joined challenge' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully updated progress' }),
    (0, common_1.Post)('complete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChallengesController.prototype, "logProgress", null);
exports.ChallengesController = ChallengesController = __decorate([
    (0, swagger_1.ApiTags)('Eco Challenges'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('challenges'),
    __metadata("design:paramtypes", [challenges_service_1.ChallengesService])
], ChallengesController);
//# sourceMappingURL=challenges.controller.js.map