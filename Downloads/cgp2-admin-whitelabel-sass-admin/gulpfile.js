var gulp = require('gulp'),
    assetRev = require('gulp-asset-rev'),
    runSequence = require('run-sequence'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector');

/*************************************************添加版本号 正式内容**********************************************/
var allSrc = [
    {
        js: 'attribute/view',
        html: '/attribute'
    },
    {
        js: 'country',
        html: '/country'
    },
    {
        js: 'cache',
        html: '/cache'
    },
    {
        js: 'cmspublish',
        html: '/cmspublish'
    },
    {
        js: 'cmspage/view',
        html: '/cmspage'
    },
    {
        js: 'cmspublishgoals/view',
        html: '/cmspublishgoals'
    },
    {
        js: 'cmsvariable',
        html: '/cmsvariable'
    },
    {
        js: 'configurationgroup',
        html: '/configgroup'
    },
    {
        js: 'currency/view',
        html: '/currency'
    },
    {
        js: 'customer/view',
        html: '/customer'
    },
/*    {
        js: 'finishedproductitem',
        html: '/finishedproductitem'
    },*/
    {
        js: 'grouppermission/view',
        html: '/grouppermission'
    },
    {
        js: 'language',
        html: '/language'
    },
    {
        js: 'mailhistory',
        html: '/mailhistory'
    },
   /* {
        js: 'manufactureorderitem',
        html: '/manufactureorderitem'
    },*/
    {
        js: 'materialviewtype',
        html: '/materialviewtype'
    },
    {
        js: 'multilingualconfig',
        html: '/multilingualconfig'
    },
    {
        js: 'numberrule',
        html: '/numberrule'
    },
    {
        js: 'orderlineitem',
        html: '/orderlineitem'
    },
    {
        js: 'orderstatusmultilingual',
        html: '/orderstatusmultilingual'
    },
    {
        js: 'orderwaittingsettlementanalyze',
        html: '/orderwaittingsettlementanalyze'
    },
    {
        js: 'pagecontentschema/view',
        html: '/pagecontentschema'
    },
    {
        js: 'partnerapplymanage',
        html: '/partnerapplys'
    },
    {
        js: 'partnerapplyresultemailconfig',
        html: '/partnerapplyresultemailconfig'
    },
    {
        js: 'project',
        html: '/project'
    },
    {
        js: 'role/view',
        html: '/role'
    },
    {
        js: 'rtattribute',
        html: '/rtattribute'
    },
    {
        js: 'rttypes',
        html: '/rttypes'
    },
    {
        js: 'website',
        html: '/website'
    },
    {
        js: 'zone',
        html: '/zone'
    },
    {
        js: 'partner/view/partnerorderreportconfigmanage',
        html: '/partnerorderreportconfigmanage'
    },
    {
        js: 'partner/view/orderNotifyConfig/view',
        html: '/partner/ordernotifyconfig'
    },
    {
        js: 'partner/view/supportableproduct/',
        html: '/partner/partnersupportableproduct'
    },
    {
        js: 'customscategory',
        html: '/customscategory'
    },
/**  nan **/
    {
        js: 'builderpublishhistory',
        html: '/builderpublishhistory'
    },
    {
        js: 'userdesigncategory',
        html: '/userdesigncategory'
    },
    {
        js: 'partner/orderstatuschangenotifyconfig',
        html: '/partner/orderstatuschangenotifyconfig'
    },
    {
        js: 'resourcesmanage',
        html: '/resourcesmanage'
    },
    {
        js: 'resourcesoperation',
        html: '/resourcesoperation'
    },
    {
        js: 'useableauthoritymanage',
        html: '/useableauthoritymanage'
    },
    {
        js: 'authorityeffectrange',
        html: '/authorityeffectrange'
    },
    {
        js: 'partner/view/ecommerceenableproductmanage',
        html: '/partner/ecommerceenableproductmanage'
    },
    {
        js: 'acprole',
        html: '/acprole'
    },
    {
        js: 'partner/view/placeorderconfig',
        html: '/partner/placeorderconfig'
    },
    {
        js: 'partner/view/supplierorderconfig',
        html: '/partner/supplierorderconfig'
    },
    {
        js: 'product/view/batchgenerateskuproduct',
        html: '/product/batchgenerateskuproduct'
    },
    {
        js: 'product/view/attributepropertyrelevanceconfig',
        html: '/product/attributepropertyrelevanceconfig'
    },
    {
        js: 'product/view/singlewayattributepropertyrelevanceconfig',
        html: '/product/singlewayattributepropertyrelevanceconfig'
    },
    {
        js: 'product/view/mappinglink',
        html: '/product/mappinglink'
    },
/**********************************************************分割线*********************************************************/
    //在html为空的元素中不能插入html不为空的元素，否则会执行报错
    {
        js: 'order/actions/invoice',
        html: ''
    },
    {
        js: 'order/actions/modifyuser',
        html: ''
    },
    {
        js: 'order/actions',
        html: ''
    },
    {
        js: 'order/actions/status',
        html: ''
    },
    {
        js: 'orderupload',
        html: ''
    },
    {
        js: 'order/actions/voacher',
        html: ''
    },
    {
        js: 'order/actions/address',
        html: ''
    }
];
//判断字符串是否为空
function isEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
    } else {
        return false;
    }
}
var jsSrcArr = ['country', 'cache', 'cmspublish', 'cmspage/view'];
var jsRevArr = [];

allSrc.forEach(function (value, index) {
    /*var valueJsIsArr = value.js instanceof Array;
     if(valueJsIsArr){
     var jsSrcArr = [];
     value.js.forEach(function(jsValue, index){
     jsSrcArr.push('./js/' + jsValue.js + '/*.js');
     })

     }else{*/
    var commonJsSrc = ['./js/' + value.js + '/*.js', './ClientLibs/extjs/ux/ux-all.js'];
    jsRevArr[index] = value.js + 'JsRev';
    gulp.task(value.js + 'JsRev', function () {
        return gulp.src(commonJsSrc)
            .pipe(rev())
            .pipe(rev.manifest())
            .pipe(gulp.dest('./rev/js/' + value.js));
    });
    //}
});
var cssSrc = './ClientLibs/extjs/ux/css/*.css',
    jsSrc = './js/attribute/view/*';


//为css中引入的图片/字体等添加hash编码
gulp.task('assetRev', function () {
    return gulp.src(cssSrc)  //该任务针对的文件
        .pipe(assetRev())    //该任务调用的模块
        .pipe(gulp.dest('./css/config')); //编译后的路径
});
//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revCss', function () {
    return gulp.src(cssSrc)
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/css'));
});
gulp.task('mainRevJs', function () {
    return gulp.src([
        './js/main/*.js',
        './ClientLibs/extjs/ux/ux-all.js'
    ])
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/js/main'));
});
gulp.task('materialInfoRevJs', function () {
    return gulp.src([
        './js/material/*.js',
        './js/material/view/InfoTab.js',
        './ClientLibs/extjs/ux/ux-all.js'
    ])
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/js/material'));
});
gulp.task('orderRevJs', function () {
    return gulp.src([
        './js/order/*.js',
        './ClientLibs/extjs/ux/ux-all.js'
    ])
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/js/order'));
});
gulp.task('orderDetailsRevJs', function () {
    return gulp.src([
        './partials/order/details/app.js',
        './ClientLibs/extjs/ux/ux-all.js'
    ])
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/js/order/detials'));
});
gulp.task('productcategoryRevJs', function () {
    return gulp.src([
        './partials/productcategory/*.js',
        './ClientLibs/extjs/ux/ux-all.js'
    ])
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/js/productcategory'));
});
gulp.task('partnerordernotifyhistoryRevJs', function () {
    return gulp.src([
        './js/partner/view/partnerordernotifyhistory/*.js',
        './js/partner/view/partnerordernotifyhistory/view/*.js',
        './ClientLibs/extjs/ux/ux-all.js'
    ])
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/js/partner/view/partnerordernotifyhistory'));
});
gulp.task('partnerRevJs', function () {
    return gulp.src([
        './js/partner/view/*.js',
        './js/partner/view/orderNotifyConfig/*.js',
        './ClientLibs/extjs/ux/ux-all.js'
    ])
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/js/partner/view'));
});
gulp.task('supplieroderstatuschangeemailnotifyconfigRevJs', function () {
    return gulp.src([
        './js/partner/view/supplieroderstatuschangeemailnotifyconfig/*.js',
        './js/partner/view/supplieroderstatuschangeemailnotifyconfig/view/*.js',
        './ClientLibs/extjs/ux/ux-all.js'
    ])
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/js/partner/view/supplieroderstatuschangeemailnotifyconfig'));
});

var specificRevJs = [
    'mainRevJs',
    'materialInfoRevJs',
    'orderRevJs',
    'orderDetailsRevJs',
    'partnerordernotifyhistoryRevJs',
    'partnerRevJs',
    'supplieroderstatuschangeemailnotifyconfigRevJs',
    'productcategoryRevJs'
];

gulp.task('mainRevHtml', function () {
    return gulp.src([
        './rev/js/main/*.json',
        './*.html'
    ])
        .pipe(revCollector())
        .pipe(gulp.dest('.'));
});
gulp.task('materialInfoRevHtml', function () {
    return gulp.src([
        './rev/js/material/*.json',
        './partials/material/*.html'

    ])
        .pipe(revCollector())
        .pipe(gulp.dest('./partials/material'));
});
//为order相关的html页面替换js路径
gulp.task('orderRevHtml', function () {
    return gulp.src([
        './rev/js/order/*.json',
        './rev/js/order/actions/address/*.json',
        './rev/js/order/actions/invoice/*.json',
        './rev/js/order/actions/modifyuser/*.json',
        './rev/js/order/actions/status/*.json',
        './rev/js/order/actions/voacher/*.json',
        './rev/js/order/actions/*.json',
        './rev/js/orderupload/*.json',
        './partials/order/*.html'
    ])
        .pipe(revCollector())
        .pipe(gulp.dest('./partials/order'));
});
gulp.task('orderDetailsRevHtml', function () {
    return gulp.src([
        './rev/js/order/detials/*.json',
        './partials/order/details/*.html'
    ])
        .pipe(revCollector())
        .pipe(gulp.dest('./partials/order/details'));
});
gulp.task('productcategoryRevHtml', function () {
    return gulp.src([
        './rev/js/productcategory/*.json',
        './partials/productcategory/*.html'
    ])
        .pipe(revCollector())
        .pipe(gulp.dest('./partials/productcategory'));
});
gulp.task('partnerordernotifyhistoryRevHtml', function () {
    return gulp.src([
        './rev/js/partner/view/partnerordernotifyhistory/*.json',
        './partials/partnerordernotifyhistory/*.html'
    ])
        .pipe(revCollector())
        .pipe(gulp.dest('./partials/partnerordernotifyhistory'));
});
gulp.task('partnerRevHtml', function () {
    return gulp.src([
        './rev/js/partner/view/*.json',
        './partials/partner/*.html'
    ])
        .pipe(revCollector())
        .pipe(gulp.dest('./partials/partner'));
});
gulp.task('supplierorderstatuschangeemailnotifyRevHtml', function () {
    return gulp.src([
        './rev/js/partner/view/supplieroderstatuschangeemailnotifyconfig/*.json',
        './partials/partner/supplierorderstatuschangeemailnotify/*.html'
    ])
        .pipe(revCollector())
        .pipe(gulp.dest('./partials/partner/supplierorderstatuschangeemailnotify'));
});
var specificRevHtml = [
    'mainRevHtml',
    'materialInfoRevHtml',
    'orderRevHtml',
    'orderDetailsRevHtml',
    'partnerordernotifyhistoryRevHtml',
    'partnerRevHtml',
    'supplierorderstatuschangeemailnotifyRevHtml',
    'productcategoryRevHtml'
];
//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
//gulp.task('revJs', function () {
//    return gulp.src(jsSrc)
//        .pipe(rev())
//        .pipe(rev.manifest())
//        .pipe(gulp.dest('./rev/js/attribute'));
//});
/*gulp.task('countryJs', function(){
 return gulp.src(countryJsSrc)
 .pipe(rev())
 .pipe(rev.manifest())
 .pipe(gulp.dest('./rev/js/country'));
 });*/
//Html替换css、js文件版本
//gulp.task('revHtml', function () {
//    return gulp.src(['./rev/js/attribute/*.json', './partials/attribute/*.html'])
//        .pipe(revCollector())
//        .pipe(gulp.dest('./partials/attribute'));
//});

var htmlSrcArr = ['country', 'cache', 'cmspublish'];
var htmlRevArr = [];

allSrc.forEach(function (value, index) {
    if (!isEmpty(value.html)) {
        var commonHtmlSrc = './partials/' + value.html + '/*.html';
        htmlRevArr[index] = value.html + 'HtmlRev';
        gulp.task(value.html + 'HtmlRev', function () {
            return gulp.src(['./rev/**/' + value.js + '/*.json', commonHtmlSrc])
                .pipe(revCollector())
                .pipe(gulp.dest('./partials' + value.html));
        });
    }
});
//gulp.task('cmspageHtmlRev', function () {
//    return gulp.src(['./rev/js/cmspage/view/*.json', './partials/cmspage/*.html'])
//        .pipe(revCollector())
//        .pipe(gulp.dest('./partials/cmspage'));
//});
//gulp.task('cmspublishHtmlRev', function () {
//    return gulp.src(['./rev/js/'++'**/*.json', './partials/cmspublish/*.html'])
//        .pipe(revCollector())
//        .pipe(gulp.dest('./partials/cmspublish'));
//});
//gulp.task('countryHtml', function () {
// return gulp.src(['./rev/**/*.json','./partials/country/*.html'])
// .pipe(revCollector())
// .pipe(gulp.dest('./partials/country'));
// });
//开发构建，默认任务
gulp.task('default', function (done) {
    runSequence(    //需要说明的是，用gulp.run也可以实现以上所有任务的执行，只是gulp.run是最大限度的并行执行这些任务，而在添加版本号时需要串行执行（顺序执行）这些任务，故使用了runSequence.
        'assetRev',
        'revCss',
        jsRevArr,
        specificRevJs
        , htmlRevArr,
        specificRevHtml,
        done);
});
