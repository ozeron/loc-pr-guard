"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var ADDITIONS_MAX_NUM = 1000;
module.exports = function (app) {
    app.on('issues.opened', function (context) { return __awaiter(_this, void 0, void 0, function () {
        var issueComment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    issueComment = context.issue({ body: 'Thanks for opening this issue!' });
                    return [4 /*yield*/, context.github.issues.createComment(issueComment)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    app.on('pull_request.synchronize', function (context) { return __awaiter(_this, void 0, void 0, function () {
        var owner, repo, name, head_sha, status, opts, result, base, head, comparison, files, allAdditions, conclusion, output, completed_at, finalOpts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.log(context);
                    owner = context.payload.pull_request.base.repo.owner.login;
                    repo = context.payload.pull_request.base.repo.name;
                    name = 'loc-guard';
                    head_sha = context.payload.pull_request.head.sha;
                    status = "queued";
                    opts = { owner: owner, repo: repo, name: name, head_sha: head_sha, status: status };
                    return [4 /*yield*/, context.github.checks.create(opts)];
                case 1:
                    result = _a.sent();
                    base = context.payload.pull_request.base.sha;
                    head = head_sha;
                    return [4 /*yield*/, context.github.repos.compareCommits({ owner: owner, repo: repo, base: base, head: head })];
                case 2:
                    comparison = _a.sent();
                    files = comparison.data.files;
                    allAdditions = files.reduce(function (a, e) { return a + e.additions; }, 0);
                    // @status = SUCCESS_STATUS
                    // @description = "Checked LOC – It smaller than #{ADDITIONS_MAX_NUM}"
                    //
                    // if calculated_changes > ADDITIONS_MAX_NUM
                    //   @status = FAILURE_STATUS
                    //   @description = "Checked LOC – It #{calculated_changes}, it's bigger than maximum #{ADDITIONS_MAX_NUM}"
                    // end
                    // create_status
                    status = "completed";
                    conclusion = "success";
                    output = {};
                    output.title = "Checked LOC \u2013 It smaller than " + ADDITIONS_MAX_NUM;
                    output.summary = 'It is ok';
                    if (allAdditions > ADDITIONS_MAX_NUM) {
                        conclusion = "failure";
                        output.title = "Checked LOC \u2013 It " + allAdditions + ", it's bigger than maximum " + ADDITIONS_MAX_NUM;
                        output.summary = 'It is have problem';
                    }
                    completed_at = (new Date()).toISOString();
                    finalOpts = { owner: owner, repo: repo, name: name, head_sha: head_sha, status: status, conclusion: conclusion, completed_at: completed_at, output: output };
                    return [4 /*yield*/, context.github.checks.create(finalOpts)];
                case 3:
                    result = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // app.on(`*`, async (context) => {
    //   context.log({ event: context.event, action: context.payload.action });
    // });
    // For more information on building apps:
    // https://probot.github.io/docs/
    // To get your app running against GitHub, see:
    // https://probot.github.io/docs/development/
};
//# sourceMappingURL=index.js.map