/**
 * Created by nan on 2020/7/20.
 * _id必填，每个导航的唯一标识,与数据库里面的_id值一样
 * block来组成tabPanel的id,必填
 * permission现在暂定为全是read的权限
 */
// afterDefaultRender:true 表示开启默认渲染功能
Ext.define('CGP.main.config.Navigation', {
    statics: {
        data: [
            {
                _id: '1',
                text: 'customer',
                leaf: false,
                permission: 'AUTH_CUSTOMER_READ',
                items: [
                    {
                        _id: 11,
                        text: '账号管理',
                        leaf: false,
                        expanded: true,
                        permission: 'AUTH_CUSTOMER_READ',
                        items: [
                            {
                                "_id": 11,
                                "text": "后台管理用户账号",
                                "leaf": true,
                                "url": "customer/customer",
                                "block": "customer",
                                "permission": "AUTH_CUSTOMER_READ",
                                // "afterDefaultRender": true, // 表示开启默认渲染功能
                            },
                            {
                                "_id": 12,
                                "text": "userAccount",
                                "leaf": true,
                                "url": "customer/whitelabel",
                                "block": "whitelabel",
                                "permission": "AUTH_CUSTOMER_READ",
                            },
                        ]
                    },
                    {
                        "_id": 12,
                        "text": "role",
                        "leaf": true,
                        "url": "role/role",
                        "block": "role",
                        "permission": "AUTH_ROLE_READ",
                    },
                    {
                        "_id": 13,
                        "text": "grouppermission",
                        "leaf": true,
                        "url": "grouppermission/grouppermission",
                        "block": "grouppermission",
                        "permission": "AUTH_GROUPPERMISSION_READ",
                    },
                    {
                        "_id": 56,
                        "text": "project",
                        "leaf": true,
                        "url": "project/project",
                        "block": "project",
                        "permission": "AUTH_PROJECT_READ",
                    },
                    {
                        "_id": 145,
                        "text": "mail subscribe",
                        "leaf": true,
                        "url": "mailsubscribe/main",
                        "block": "mailsubscribe",
                        "permission": "AUTH_MAILSUBSCRIBE_READ",
                    }]
            },
            {
                "_id": 2,
                "pid": 0,
                "text": "baseData",
                "leaf": false,
                "permission": "AUTH_LANGUAGE_READ",
                items: [
                    /* {
                         "_id": 22,
                         "text": "currency",
                         "leaf": true,
                         "url": "currency/currency",
                         "block": "currency",
                         "permission": "AUTH_CURRENCY_READ",
                     },*/
                    {
                        "_id": 21,
                        "text": "language",
                        "leaf": true,
                        "url": "language/language",
                        "block": "language",
                        "permission": "AUTH_LANGUAGE_READ",
                    },
                    {
                        "_id": 23,
                        "text": "country",
                        "leaf": true,
                        "url": "country/country",
                        "block": "country",
                        "permission": "AUTH_COUNTRY_VIEW",
                    },
                    {
                        "_id": 24,
                        "text": "zone",
                        "leaf": true,
                        "url": "zone/zone",
                        "block": "zone",
                        "permission": "AUTH_ZONE_READ",
                    },
                    {
                        "_id": 25266946,
                        "text": "organization",
                        "leaf": true,
                        "url": "organizations/main",
                        "block": "organizations",
                        "permission": "AUTH_ORGANIZATIONS_READ",
                    },
                    {
                        "_id": 42,
                        "text": "website",
                        "leaf": true,
                        "url": "website/website",
                        "block": "website",
                        "permission": "AUTH_WEBSITE_READ",
                    },
                    {
                        "_id": 43,
                        "text": "configgroup",
                        "leaf": true,
                        "url": "configgroup/configgroup",
                        "block": "configgroup",
                        "permission": "AUTH_CONFIGGROUP_READ",
                    },
                    {
                        "_id": 106,
                        "text": "systemcache",
                        "leaf": true,
                        "url": "cache/cache",
                        "block": "cache",
                        "permission": "AUTH_CACHE_DELETE",
                    },
                    {
                        "_id": 190,
                        "text": "numberrule",
                        "leaf": true,
                        "url": "numberrule/numberrulemanage",
                        "block": "numberrule",
                        "permission": "AUTH_NUMBERRULE_READ",
                    },
                    {
                        "_id": 337354,
                        "text": "multilingual config",
                        "leaf": true,
                        "url": "multilingualconfig/main",
                        "block": "multilingualconfig",
                        "permission": "AUTH_MULTILINGUALCONFIG_READ",
                    },
                    {
                        "_id": 1039409,
                        "text": "machineModel",
                        "leaf": true,
                        "url": "printmachine/main",
                        "block": "printmachine",
                        "permission": "AUTH_PRINTMACHINE_READ",
                    },
                    {
                        "_id": 1784531,
                        "text": "operationLog",
                        "leaf": true,
                        "url": "operationlog/main",
                        "block": "operationlog",
                        "permission": "AUTH_OPERATIONLOG_READ",
                    },
                    {
                        "_id": 'feignLog',
                        "text": "Feign日志",
                        "leaf": true,
                        "url": "feign_log/main",
                        "block": "feign_log",
                        "permission": "AUTH_OPERATIONLOG_READ",
                    },

                    {
                        "_id": 6054643,
                        "text": "fontmanage",
                        "leaf": true,
                        "url": "font/main",
                        "block": "font",
                        "permission": "AUTH_FONT_READ",
                    },
                    {
                        "_id": 14604012,
                        "text": "color",
                        "leaf": true,
                        "url": "color/main",
                        "block": "color",
                        "permission": "AUTH_COLOR_READ",
                    },
                    {
                        "_id": 15535622,
                        "text": "background",
                        "leaf": true,
                        "url": "background/main",
                        "block": "background",
                        "permission": "AUTH_BACKGROUND_READ",
                    },
                    {
                        "_id": 15995019,
                        "text": "monthImageGroup",
                        "leaf": true,
                        "url": "monthimagegroup/main",
                        "block": "monthimagegroup",
                        "permission": "AUTH_MONTHIMAGEGROUP_READ",
                    },
                    {
                        "_id": 15995034,
                        "text": "holidayInfo",
                        "leaf": true,
                        "url": "holidayinfo/main",
                        "block": "'holidayinfo'",
                        "permission": "AUTH_HOLIDAYINFO_READ",
                    },
                    {
                        "_id": 16872793,
                        "text": "threeDModel",
                        "leaf": true,
                        "url": "threedmodelconfig/main",
                        "block": "'threedmodelconfig'",
                        "permission": "AUTH_THREEDMODEL_READ",
                    },
                    {
                        "_id": 19878237,
                        "text": "threeDPreviewPlan",
                        "leaf": true,
                        "url": "threedpreviewplan/main",
                        "block": "threedpreviewplan",
                        "permission": "AUTH_THREEDPREVIEWPLAN_READ",
                    },
                    {
                        "_id": 20533335,
                        "text": "数量计运费规则",
                        "leaf": true,
                        "url": "areashippingconfigtemplate/main",
                        "block": "areashippingconfigtemplate",
                        "permission": "AUTH_AREASHIPPINGCONFIGTEMPLATE_READ",
                    },
                    {
                        "_id": '51645829',
                        "text": "重量计运费规则",
                        "leaf": true,
                        "url": "postageconfigforweight/main",
                        "block": "postageconfigforweight",
                        "permission": "AUTH_CUSTOMER_READ",
                    },
                    {
                        "_id": 20533294,
                        "text": "shippingQuotationTemplate",
                        "leaf": true,
                        "url": "shippingquotationtemplatemanage/main",
                        "block": "shippingquotationtemplatemanage",
                        "permission": "AUTH_SHIPPINGQUOTATIONTEMPLATE_READ",
                    },
                    {
                        "_id": 21841173,
                        "text": "tax",
                        "leaf": true,
                        "url": "tax/app/view/main",
                        "block": "tax/app/view",
                        "permission": "AUTH_TAX/APP/VIEW_READ",
                    },
                    {
                        "_id": 21844289,
                        "text": "areaAmountRule",
                        "leaf": true,
                        "url": "areaamountrule/main",
                        "block": "areaamountrule",
                        "permission": "AUTH_AREAAMOUNTRULE_READ",
                    },
                    {
                        "_id": 23032587,
                        "text": "exception",
                        "leaf": true,
                        "url": "exception/app/view/main",
                        "block": "exception",
                        "permission": "AUTH_EXCEPTION_READ",
                    },
                    {
                        "_id": 18324669,
                        "text": "multiLanguageConfig",
                        "leaf": true,
                        "url": "multilanguageconfig/main",
                        "block": "multilanguageconfig",
                        "permission": "AUTH_MULTILANGUAGECONFIG_READ",
                    },
                    {
                        "_id": 9990187,
                        "text": "orderStatus",
                        "leaf": true,
                        "url": "orderstatus/main",
                        "block": "orderstatus",
                        "permission": "AUTH_ORDERSTATUS_102",
                    },
                    {
                        "_id": 20594133,
                        "text": "resourceManage",
                        "leaf": true,
                        "url": "resource/index",
                        "block": "resource",
                        "permission": "AUTH_RESOURCE_READ",
                    },
                    {
                        "_id": 21862899,
                        "text": "tax",
                        "leaf": true,
                        "url": "tax/app/view/main",
                        "block": "tax",
                        "permission": "AUTH_TAX_READ",
                    },
                    {
                        "_id": 'promotion',
                        "text": i18n.getKey('优惠活动'),
                        "leaf": true,
                        "url": "promotion/main",
                        "block": "promotion",
                        "permission": "AUTH_PROMOTION_READ",
                    },
                    {
                        "_id": 'saleTag',
                        "text": i18n.getKey('销售标签'),
                        "leaf": true,
                        "url": "saletag/main",
                        "block": "saleTag",
                        "permission": "AUTH_CUSTOMER_READ",
                    },
                    {
                        "_id": 'QP税资质',
                        "text": i18n.getKey('QP税资质'),
                        "leaf": true,
                        "url": "vat/main2",
                        "block": "qp_vat",
                        "permission": "AUTH_CUSTOMER_READ",
                    },
                    {
                        "_id": 'QP计运费规则',
                        "text": i18n.getKey('QP重量计运费规则'),
                        "leaf": true,
                        "url": "qpconfig/postageconfig/shipmentconfig",
                        "block": "qpconfig/postageconfig",
                        "permission": "AUTH_CUSTOMER_READ",
                    },
                    {
                        "_id": 'QPMN税',
                        "text": i18n.getKey('QPMN税'),
                        "leaf": true,
                        "url": "qpmn_tax/main",
                        "block": "qpmn_tax",
                        "permission": "AUTH_CUSTOMER_READ",
                    },
                    {
                        "_id": 'QPMN免税管理',
                        "text": i18n.getKey('QPMN免税管理'),
                        "leaf": true,
                        "url": "qpmn_tax_switch/main",
                        "block": "qpmn_tax_switch",
                        "permission": "AUTH_CUSTOMER_READ",
                    },
                    {
                        "_id": 'ImportService费用',
                        "text": i18n.getKey('ImportService费用'),
                        "leaf": true,
                        "url": "import_service/main",
                        "block": "import_service",
                        "permission": "AUTH_CUSTOMER_READ",
                    },
                    /*      {
                              "_id": '生产基地',
                              "text": i18n.getKey('生产基地'),
                              "leaf": true,
                              "url": "product_location/main",
                              "block": "product_location",
                              "permission": "AUTH_CUSTOMER_READ",
                          },*/
                    {
                        "_id": '运费优惠',
                        "text": i18n.getKey('运费优惠'),
                        "leaf": true,
                        "url": "platform_shipping_price/main",
                        "block": "platform_shipping_price",
                        "permission": "AUTH_CUSTOMER_READ",
                    },
                    {
                        "_id": '产品价格组成',
                        "text": i18n.getKey('产品价格组成'),
                        "leaf": true,
                        "url": "product_price_component/main",
                        "block": "product_price_component",
                        "permission": "AUTH_CUSTOMER_READ",
                    },
                    {
                        "_id": '产品生产缓冲配置',
                        "text": i18n.getKey('产品生产缓冲配置'),
                        "leaf": true,
                        "url": "producebufferdayssetting/main",
                        "block": "producebufferdayssetting",
                        "permission": "AUTH_CUSTOMER_READ",
                    }
                ]
            },
            {
                "_id": 1703460,
                "text": "dynamicsizeConfig",
                "leaf": false,
                "block": "dynamicsize",
                "permission": "AUTH_DYNAMICSIZE_READ",
                items: [
                    {
                        "_id": 1703459,
                        "text": "dsdatasource",
                        "leaf": true,
                        "url": "dsdatasource/main",
                        "block": "dsdatasource",
                        "permission": "AUTH_DSDATASOURCE_READ",

                    },
                    {
                        "_id": 1704039,
                        "text": "dspagetemplateconfig",
                        "leaf": true,
                        "url": "dspagetemplateconfig/main",
                        "block": "dspagetemplateconfig",
                        "permission": "AUTH_DSPAGETEMPLATECONFIG_READ",

                    },
                    {
                        "_id": 1704487,
                        "text": "dsrequesttemplate",
                        "leaf": true,
                        "url": "dsrequesttemplate/main",
                        "block": "dsrequesttemplate",
                        "permission": "AUTH_DSREQUESTTEMPLATE_READ",
                    },
                    {
                        "_id": 1704499,
                        "text": "dssheettemplateconfig",
                        "leaf": true,
                        "url": "dssheettemplateconfig/main",
                        "block": "dssheettemplateconfig",
                        "permission": "AUTH_DSSHEETTEMPLATECONFIG_READ",
                    },
                    {
                        "_id": 1704513,
                        "text": "dsurltemplate",
                        "leaf": true,
                        "url": "dsurltemplate/main",
                        "block": "dsurltemplate",
                        "permission": "AUTH_DSURLTEMPLATE_READ",
                    }
                ]
            },
            {
                "_id": 4,
                "pid": 0,
                "text": "order",
                "leaf": false,
                "expanded": true,
                "permission": "AUTH_ORDER_READ",
                items: [
                    {
                        "_id": 41,
                        "pid": 4,
                        "text": "allOrder",
                        "leaf": true,
                        block: 'order',
                        "afterDefaultRender": true, // 表示开启默认渲染功能
                        "url": "order/order",
                        "permission": "AUTH_ORDER_READ",
                    },
                    {
                        "_id": 68,
                        "pid": 4,
                        "text": "Waiting payment",
                        "leaf": false,
                        block: 'order',
                        "permission": "AUTH_ORDERSTATUS_100",
                        expanded: true,//标识改节点需要展开
                        items: [
                            {
                                "_id": 83,
                                "text": "所有待付款订单",
                                "leaf": true,
                                "url": "order/order?statusId=100&paymentModuleCode=PayPal",
                                "permission": "AUTH_ORDERSTATUS_100",
                            },
                            {
                                "_id": 85,
                                "text": "支付待确认订单",
                                "leaf": true,
                                "url": "order/order?statusId=100&paymentModuleCode=BankTransfer",
                                "permission": "AUTH_ORDERSTATUS_100",
                            },
                        ]
                    },
                    {
                        "_id": 84,
                        "pid": 4,
                        "text": "paid(waiting audit)",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=101",
                        "permission": "AUTH_ORDERSTATUS_101",
                    },
                    //已确认，待审核
                    {
                        "_id": 110,
                        "pid": 4,
                        "text": "已确认（待审核）",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=110",
                        "permission": "AUTH_ORDERSTATUS_110",
                    },
                    {
                        "_id": 86,
                        "pid": 4,
                        "text": "Payment declined",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=40",
                        "permission": "AUTH_ORDERSTATUS_40",
                    },
                    //已付款，待排版
                    {
                        _id: 117,
                        "pid": 4,
                        "text": "PAYMENTED_PAIBAN_STATUS",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=117",
                        "permission": "AUTH_ORDERSTATUS_117",
                    },
                    /*//已确认（待排版）
                    {
                        _id: 116,
                        "pid": 4,
                        "text": "CONFIRMED_PAIBAN_STATUS",
                        "leaf": true,
                        "url": "order/order?statusId=116",
                        "permission": "AUTH_ORDERSTATUS_116",
                    },
                    //排版失败
                    {
                        _id: 44,
                        "pid": 4,
                        "text": "Paiban failed",
                        "leaf": true,
                        "url": "order/order?statusId=44",
                        "permission": "AUTH_ORDERSTATUS_44",
                    },
                    //正在排版
                    {
                        "_id": 105,
                        "pid": 4,
                        "text": "composing",
                        "leaf": true,
                        "url": "order/order?statusId=113",
                        "permission": "AUTH_ORDERSTATUS_113",
                    },*/

                    //已排版待审核
                    {
                        _id: 118,
                        "pid": 4,
                        "text": "PAIBANED_CHECK_STATUS",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=118",
                        "permission": "AUTH_ORDERSTATUS_118",
                    },
                    //已审核（待生产）
                    {
                        _id: 37681428,
                        "pid": 4,
                        "text": "CHECKED_PRODUCING_STATUS",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=37681428",
                        "permission": "AUTH_ORDERSTATUS_37681428",
                    },
                    /* //已审核 待打印 废弃
                     {
                         _id: 119,
                         "pid": 4,
                         "text": "CHECKED_PRINT_STATUS",
                         "leaf": true,
                         "url": "order/order?statusId=119",
                         "permission": "AUTH_ORDERSTATUS_119",
                     },
                     //已打印，待生产
                     {
                         "_id": 74,
                         "pid": 4,
                         "text": "printed(waiting produce)",
                         "leaf": true,
                         "url": "order/order?statusId=104",
                         "permission": "AUTH_ORDERSTATUS_104",
                     },*/

                    //9358697生产中,以前的需重做，就是把状态改为生产中
                    {
                        "_id": 9358697,
                        "pid": 4,
                        "text": "producing",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=9358697",
                        "permission": "AUTH_ORDERSTATUS_9358697",
                    },
                    //已生产待组装
                    {
                        _id: 120,
                        "pid": 4,
                        "text": "PRODUCTED_ASSEMBL_STATUS",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=120",
                        "permission": "AUTH_ORDERSTATUS_120",
                    },
                    //已组装,待装箱
                    {
                        _id: 121,
                        "pid": 4,
                        "text": "ASSEMBLED_BOX_STATUS",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=121",
                        "permission": "AUTH_ORDERSTATUS_121",
                    },
                    //已装箱，待交收
                    {
                        _id: 122,
                        "pid": 4,
                        "text": "BOXED_DELIVERY_STATUS",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=122",
                        "permission": "AUTH_ORDERSTATUS_122",
                    },
                    //已交收，待发货
                    {
                        "_id": 76,
                        "pid": 4,
                        "text": "settlemented(waiting deliver)",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=106",
                        "permission": "AUTH_ORDERSTATUS_106",
                    },
                    //已发货待签收
                    {
                        "_id": 77,
                        "pid": 4,
                        "text": "delivered(waiting receipt)",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=107",
                        "permission": "AUTH_ORDERSTATUS_107",
                    },
                    //已签收待完成
                    {
                        "_id": 78,
                        "pid": 4,
                        "text": "receipted(waiting complete)",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=108",
                        "permission": "AUTH_ORDERSTATUS_108",
                    },
                    //交易完成
                    {
                        "_id": 79,
                        "pid": 4,
                        "text": "deal complete",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=109",
                        "permission": "AUTH_ORDERSTATUS_109",
                    },
                    //已退款
                    {
                        _id: '36585000',
                        "pid": 4,
                        "text": "REFUNDED_STATUS",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=36585000",
                        "permission": "AUTH_ORDERSTATUS_36585000",
                    },
                    {
                        "_id": 153,
                        "pid": 4,
                        "text": "confirmed(third-party order)",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=301",
                        "permission": "AUTH_ORDERSTATUS_301",
                    },
                    {
                        "_id": 474999,
                        "pid": 4,
                        "text": "redo-settlemented(waiting deliver)",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=106&isRedo=true",
                        "permission": "AUTH_ORDERSTATUS_REDO",
                    },
                    {
                        "_id": 80,
                        "pid": 4,
                        "text": "drwd",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=111",
                        "permission": "AUTH_ORDERSTATUS_111",
                    },
                    {
                        "_id": 475000,
                        "pid": 4,
                        "text": "redo-delivered(waiting receipt)",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=107&isRedo=true",
                        "permission": "AUTH_ORDERSTATUS_REDO",
                    },
                    {
                        "_id": 81,
                        "pid": 4,
                        "text": "returned(delivered)",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=112",
                        "permission": "AUTH_ORDERSTATUS_112",
                    },
                    //待结算
                    {
                        "_id": 188,
                        "pid": 4,
                        "text": "Wait settlement",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=224098",
                        "permission": "AUTH_ORDERSTATUS_224098",
                    },
                    //已结算
                    {
                        "_id": 189,
                        "pid": 4,
                        "text": "settlement",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=224101",
                        "permission": "AUTH_ORDERSTATUS_224101",
                    },
                    {
                        "_id": 240798,
                        "pid": 4,
                        "text": "non-approval",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=240710",
                        "permission": "AUTH_ORDERSTATUS_240710",
                    },
                    //客户取消41
                    {
                        "_id": 87,
                        "pid": 4,
                        "text": "Canceled",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=41",
                        "permission": "AUTH_ORDERSTATUS_41",
                    },
                    //不可生产已取消
                    {
                        "_id": 88,
                        "pid": 4,
                        "text": "can not produce,canceled",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=42",
                        "permission": "AUTH_ORDERSTATUS_42",
                    },

                    {
                        "_id": 141,
                        "text": "audited(wating order picking)",
                        "leaf": true,
                        "url": "order/order?statusId=114",
                        block: 'order',
                        "permission": "AUTH_ORDERSTATUS_114",
                    },
                    {
                        "_id": 143,
                        "pid": 4,
                        "text": "order picked(waiting settlement)",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=115",
                        "permission": "AUTH_ORDERSTATUS_115",
                    },
                    {
                        "_id": 72,
                        "pid": 4,
                        "text": "audited(waiting compose)",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=102",
                        "permission": "AUTH_ORDERSTATUS_102",
                    },
                    {
                        "_id": 73,
                        "pid": 4,
                        "text": "composed(waiting print)",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=103",
                        "permission": "AUTH_ORDERSTATUS_103",
                    },
                    {
                        "_id": 474910,
                        "pid": 4,
                        "text": "redo-confirmed(waitting print)",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=103&isRedo=true",
                        "permission": "AUTH_ORDERSTATUS_REDO",
                    },
                    {
                        "_id": 474984,
                        "pid": 4,
                        "text": "redo-printed(waiting produce)",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=104&isRedo=true",
                        "permission": "AUTH_ORDERSTATUS_REDO",
                    },
                    {
                        "_id": 75,
                        "pid": 4,
                        "text": "produced(waiting settlement)",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=105",
                        "permission": "AUTH_ORDERSTATUS_105",
                    },
                    {
                        "_id": 474998,
                        "pid": 4,
                        "text": "redo-produced(waiting settlement)",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=105&isRedo=true",
                        "permission": "AUTH_ORDERSTATUS_REDO",
                    },
                    {
                        _id: 30254655,
                        "pid": 4,
                        "text": "SYSTEM_CANCELLED_STATUS",
                        "leaf": true,
                        block: 'order',
                        "url": "order/order?statusId=30254655",
                        "permission": "AUTH_ORDERSTATUS_30254655",
                    },
                    {
                        "_id": '拼单信息处理',
                        "pid": 4,
                        "text": "拼单信息处理",
                        "leaf": false,
                        "permission": "AUTH_ORDERSTATUS_REDO",
                        expanded: true,//标识改节点需要展开
                        //INITIALIZED,
                        // IN_PROGRESS,
                        // COMPLETED,
                        // FAILED
                        items: [
                            {
                                "_id": 'INITIALIZED',
                                "text": "初始化",
                                "leaf": true,
                                "pid": 4,
                                block: "order_processing",
                                "url": "order_processing/main?orderPostPreprocessTaskStatus=INITIALIZED",
                                "permission": "AUTH_ORDERSTATUS_100",
                            },
                            {
                                "_id": 'IN_PROGRESS',
                                "text": "处理中",
                                "leaf": true,
                                "pid": 4,
                                block: "order_processing",
                                "url": "order_processing/main?orderPostPreprocessTaskStatus=IN_PROGRESS",
                                "permission": "AUTH_ORDERSTATUS_100",
                            },
                            {
                                "_id": 'FAILED',
                                "text": "失败",
                                "leaf": true,
                                "pid": 4,
                                block: "order_processing",
                                "url": "order_processing/main?orderPostPreprocessTaskStatus=FAILED",
                                "permission": "AUTH_ORDERSTATUS_100",
                            },
                        ]
                    },
                    /*    {
                            "_id": 142,
                            "pid": 4,
                            "text": "upload order document",
                            "leaf": true,
                            "url": "order/upload",
                            "block": "orderupload",
                            "permission": "AUTH_ORDER_UPLOAD_FILE",
                        },
                        {
                            "_id": 1927591,
                            "pid": 4,
                            "text": "CGPPlaceOrder",
                            "leaf": true,
                            "url": "order/cgpplaceorder/main",
                            "block": "CGPPlaceOrderMain",
                            "permission": "AUTH_CGPPLACEORDER_READ",
                        },*/
                ]
            },
            {
                _id: 'summary',
                pid: 0,
                text: '订单报表',
                leaf: false,
                permission: "AUTH_ORDER_READ",
                items: [
                    {
                        _id: 'account',
                        pid: 'account',
                        block: "account",
                        text: '销售报表(Account)',
                        permission: "AUTH_ORDER_READ",
                        url: "ordersummary/account",
                        leaf: true
                    },
                    {
                        _id: 'cutOff',
                        pid: 'cutOff',
                        block: "cutoff",
                        text: '销售报表(Cut Off)',
                        permission: "AUTH_ORDER_READ",
                        url: "ordersummary/cutoff",
                        leaf: true
                    },
                    {
                        _id: 'QpAccount',
                        pid: 'QpAccount',
                        block: "QpAccount",
                        text: 'QP销售报表(Account)',
                        permission: "AUTH_ORDER_READ",
                        url: "ordersummary/qpaccount",
                        leaf: true
                    },
                    {
                        _id: 'QpCutOff',
                        pid: 'QpCutOff',
                        block: "QpCutOff",
                        text: 'QP销售报表(Cut Off)',
                        permission: "AUTH_ORDER_READ",
                        url: "ordersummary/qpcutoff",
                        leaf: true
                    },
                    {
                        _id: 'customerOrder',
                        pid: 'customerOrder',
                        block: "customerOrder",
                        text: 'customer order统计报表',
                        permission: "AUTH_ORDER_READ",
                        url: "extraorderreportforms/customer",
                        leaf: true
                    },
                    {
                        _id: 'partnerOrder',
                        pid: 'partnerOrder',
                        block: "partnerOrder",
                        text: 'partner order统计报表',
                        permission: "AUTH_ORDER_READ",
                        url: "extraorderreportforms/partner",
                        leaf: true
                    },
                    {
                        _id: 'sampleOrder',
                        pid: 'sampleOrder',
                        block: "sampleOrder",
                        text: 'sample order统计报表',
                        permission: "AUTH_ORDER_READ",
                        url: "extraorderreportforms/sample",
                        leaf: true
                    },
                ]
            },
            // 发货
            {
                "_id": 17497635,
                "text": "delivery",
                "leaf": false,
                "permission": "AUTH_DELIVERYORDER_READ",
                "clazz": "com.qpp.cgp.domain.management.Navigator",
                items: [
                    //发货要求
                    {
                        "_id": 17497779,
                        "text": "shipmentRequirement",
                        "url": "shipmentrequirement/main",
                        leaf: true,
                        "block": "shipmentrequirement",
                        "permission": "AUTH_SHIPMENTREQUIREMENT_READ",
                    },
                    //发货订单
                    {
                        "_id": 17497783,
                        "text": "deliveryOrder",
                        "url": "deliveryorder/main",
                        leaf: true,
                        "block": "deliveryorder",
                        "permission": "AUTH_DELIVERYORDER_READ",
                    }
                ]
            },
            {
                "_id": 23372798,
                "clazz": "com.qpp.cgp.domain.management.Navigator",
                "text": "退货|退款",
                "leaf": false,
                permission: 'AUTH_CUSTOMER_READ',
                items: [
                    {
                        "_id": 34266650,
                        "text": "returnOrder",
                        "leaf": true,
                        "block": "returnorder",
                        "url": "returnorder/app/view/main",
                        "permission": "AUTH_RETURNORDER_READ",
                    },
                    {
                        "_id": 34266658,
                        "text": "退款申请",
                        "leaf": true,
                        "url": "orderrefund/main",
                        "block": "orderrefund",
                        "permission": "AUTH_RETURNORDER_READ",
                    }
                ]
            },
            {
                "_id": 123,
                "clazz": "com.qpp.cgp.domain.management.Navigator",
                "text": "orderlineitem manager",
                "leaf": false,
                permission: 'AUTH_CUSTOMER_READ',
                items: [
                    {
                        "_id": 126,
                        "clazz": "com.qpp.cgp.domain.management.Navigator",
                        "text": "composed(waiting print)",
                        "leaf": true,
                        "permission": "AUTH_ORDERLINEITEM_READ",
                        "url": "orderlineitem/orderlineitem?statusId=103",
                        "block": "orderlineitem"
                    },
                    {
                        "_id": 127,
                        "clazz": "com.qpp.cgp.domain.management.Navigator",
                        "text": "printed(waiting produce)",
                        "leaf": true,
                        "permission": "AUTH_ORDERLINEITEM_READ",
                        "url": "orderlineitem/orderlineitem?statusId=104",
                        "block": "orderlineitem",
                    },
                    {
                        "_id": 128,
                        "clazz": "com.qpp.cgp.domain.management.Navigator",
                        "text": "produced(waiting settlement)",
                        "leaf": true,
                        "permission": "AUTH_ORDERLINEITEM_READ",
                        "url": "orderlineitem/orderlineitem?statusId=105",
                        "block": "orderlineitem"
                    },
                    {
                        "_id": 132,
                        "clazz": "com.qpp.cgp.domain.management.Navigator",
                        "text": "settlemented(waiting deliver)",
                        "leaf": true,
                        "permission": "AUTH_ORDERLINEITEM_READ",
                        "url": "orderlineitem/orderlineitem?statusId=106",
                        "block": "orderlineitem"
                    },
                    {
                        "_id": 133,
                        "clazz": "com.qpp.cgp.domain.management.Navigator",
                        "text": "complete deliver",
                        "leaf": true,
                        "permission": "AUTH_ORDERLINEITEM_READ",
                        "url": "orderlineitem/orderlineitem?statusId=107",
                        "block": "orderlineitem"
                    },
                    {
                        "_id": 124,
                        "clazz": "com.qpp.cgp.domain.management.Navigator",
                        "text": "all status",
                        "leaf": true,
                        "permission": "AUTH_ORDERLINEITEM_READ",
                        "url": "orderlineitem/orderlineitem",
                        "block": "orderlineitem"
                    }
                ]
            },
            {
                "_id": 262317,
                "clazz": "com.qpp.cgp.domain.management.Navigator",
                "text": "saleStatistics",
                "leaf": false,
                permission: 'AUTH_CUSTOMER_READ',
                items: [
                    {
                        "_id": 262392,
                        "text": "order waitting settlement analyze",
                        "leaf": true,
                        "url": "orderwaittingsettlementanalyze/main",
                        "block": "orderwaittingsettlementanalyze",
                        "permission": "AUTH_ORDERWAITTINGSETTLEMENTANALYZE_READ",
                    }
                ]
            },
            {
                "_id": 146,
                "text": "customerServices",
                "leaf": false,
                "permission": 'AUTH_MAILHISTORY_READ',
                "items": [
                    {
                        "_id": 147_1,
                        "text": "mail history",
                        "leaf": true,
                        "url": "mailhistory/mailhistory",
                        "block": "mailhistory",
                        "permission": "AUTH_MAILHISTORY_READ",
                    },
                    {
                        "_id": 147_2,
                        "text": "contactInformations",
                        "leaf": true,
                        "url": "contactInformations/main",
                        "block": "contactInformations",
                        "permission": "AUTH_MAILHISTORY_READ",
                    },
                    {
                        "_id": 147_3,
                        "text": "拼单历史记录",
                        "leaf": true,
                        "url": "orderinghistoryrecord/main",
                        "block": "orderinghistoryrecord",
                        "permission": "AUTH_MAILHISTORY_READ",
                    },
                    {
                        "_id": 147_4,
                        "text": "partner配置修改记录",
                        "leaf": true,
                        "url": "partnerconfigeditrecord/main",
                        "block": "partnerconfigeditrecord",
                        "permission": "AUTH_MAILHISTORY_READ",
                    }
                ]
            },
            {
                "_id": 149,
                "text": "CMS",
                "leaf": false,
                permission: 'AUTH_CMSPAGE_READ',
                items: [
                    {
                        "_id": 150,
                        "pid": 149,
                        "text": "page",
                        "leaf": true,
                        "url": "cmspage/cmspage",
                        "block": "cmspage",
                        "permission": "AUTH_CMSPAGE_READ",
                    },
                    {
                        "_id": 160,
                        "pid": 149,
                        "text": "cmsvariable",
                        "leaf": true,
                        "url": "cmsvariable/main",
                        "block": "cmsvariable",
                        "permission": "AUTH_CMSVARIABLE_READ",
                    },
                    {
                        "_id": 180,
                        "pid": 149,
                        "text": "cmsPublishGoals",
                        "leaf": true,
                        "url": "cmspublishgoals/main",
                        "block": "cmspublishgoals",
                        "permission": "AUTH_CMSPUBLISHGOAL_READ",
                    },
                    {
                        "_id": 543102,
                        "pid": 149,
                        "text": "builderPublishHistory",
                        "leaf": true,
                        "url": "builderpublishhistory/builderpublishhistory",
                        "block": "builderpublishhistory",
                        "permission": "AUTH_BUILDPUBILSHHISTORY_READ",
                    }
                ]
            },
            {
                _id: '22369169',
                text: "网站发布管理",
                leaf: false,
                permission: 'AUTH_CMSPAGE_READ',
                items: [
                    {
                        _id: 'baseConfig',
                        text: 'baseConfig',
                        leaf: false,
                        permission: 'AUTH_CMSPAGE_READ',
                        items: [
                            {
                                "_id": 27575060,
                                "text": "cmsContext",
                                "leaf": true,
                                "url": "cmscontext/main",
                                "block": "cmscontext",
                                "permission": "AUTH_CMSCONTEXT_READ",
                            },
                            {
                                "_id": 27419351,
                                "text": "cmsPagesTemplate",
                                "leaf": true,
                                "url": "cmspagestemplate/main",
                                "block": "cmspagestemplate",
                                "permission": "AUTH_CMSPAGESTEMPLATE_READ",
                            },
                            {
                                "_id": 26364778,
                                "text": "CMSPages",
                                "leaf": true,
                                "url": "cmspages/main",
                                "block": "cmspages",
                                "permission": "AUTH_CMSPAGES_READ",
                            },

                        ]
                    },
                    {
                        _id: 26364779,
                        text: '页面实例配置',
                        leaf: false,
                        permission: 'AUTH_CMSPAGE_READ',
                        items: [
                            {
                                _id: 26364780,
                                "text": "normalPagePublishConfig",
                                "leaf": true,
                                "url": "cmsconfig/main?type=NormalPage",
                                "block": "cmsconfig",
                                "permission": "AUTH_CMSCONFIG_READ",
                            },
                            {
                                "_id": 26708393,
                                "text": "categoryPublishConfig",
                                "leaf": true,
                                "url": "cmsconfig/main?type=ProductCategory",
                                "block": "cmsconfig",
                                "permission": "AUTH_CMSCONFIG_READ",
                            },
                            {
                                "_id": '26693110',
                                "text": "productPublishConfig",
                                "leaf": true,
                                "url": "cmsconfig/productcmsconfig",
                                "block": "cmsconfig",
                                "permission": "AUTH_CMSCONFIG_READ",
                            }]
                    },
                    {
                        "_id": '网站产品管理',
                        "pid": 0,
                        "text": i18n.getKey('网站产品管理'),
                        "leaf": false,
                        "permission": "AUTH_LANGUAGE_READ",
                        "items": [
                            {
                                "_id": '产品网店配置',
                                "text": i18n.getKey('产品网店配置'),
                                "leaf": true,
                                "url": "websiteproductlist/main",
                                "block": "websiteproductlist",
                                "permission": "AUTH_CUSTOMER_READ",
                            },
                        ]
                    },
                    {
                        _id: '27575059',
                        text: '产品属性表单发布',
                        leaf: false,
                        permission: 'AUTH_CMSPAGE_READ',
                        items: [
                            {
                                "_id": 'Group组件配置',
                                "text": "Group组件配置",
                                "leaf": true,
                                "url": "cms_group_config/main",
                                "block": "cms_group_config",
                                "permission": "AUTH_CMSPAGES_READ",
                            },
                            {
                                "_id": 26364779,
                                "text": "表单组件渲染模板",
                                "leaf": true,
                                "url": "cmsformcomponentrendertemplate/main",
                                "block": "cmsformcomponentrendertemplate",
                                "permission": "AUTH_CMSPAGES_READ",
                            },
                        ]
                    },
                    {
                        "_id": 26488170,
                        "text": "CMSLog",
                        "leaf": true,
                        "url": "cmslog/main",
                        "block": "cmslog",
                        "permission": "AUTH_CMSLOG_READ",
                    },
                    {
                        "_id": 26704870,
                        "text": "productCatalog",
                        "leaf": true,
                        "url": "productcatalog/main",
                        "block": "productcatalog",
                        "permission": "AUTH_PRODUCTCATALOG_READ",
                    },
                    {
                        "_id": 26708887,
                        "text": "saleProductCatalog",
                        "leaf": true,
                        "url": "saleproductcatalog/main",
                        "block": "saleproductcatalog",
                        "permission": "AUTH_PRODUCTCATALOG_READ",
                    }
                ]
            },
            {
                "_id": 'website_config_management',
                "pid": 0,
                "text": i18n.getKey('网站配置管理'),
                "leaf": false,
                "expanded": true,//标识改节点需要展开
                "permission": "AUTH_WEBSITE_CONFIG_MANAGEMENT_READ",
                "items": [
                    {
                        "_id": '网站货币汇率配置',
                        "text": i18n.getKey('网站货币汇率配置'),
                        "leaf": true,
                        "url": "currencyconfig/mainPanel",
                        "block": "websiteCurrencyConfig",
                        "permission": "AUTH_CUSTOMER_READ",
                    },
                    {
                        "_id": '货币汇率管理',
                        "pid": 0,
                        "text": i18n.getKey('货币汇率管理'),
                        "leaf": false,
                        "expanded": true,//标识改节点需要展开
                        "permission": "AUTH_LANGUAGE_READ",
                        "items": [
                            {
                                "_id": '货币配置',
                                "text": i18n.getKey('货币配置'),
                                "leaf": true,
                                "url": "currency/currency",
                                "block": "currency",
                                "permission": "AUTH_CUSTOMER_READ",
                            },
                            {
                                "_id": '汇率配置',
                                "text": i18n.getKey('汇率配置'),
                                "leaf": true,
                                "url": "exchangerateconfig/main",
                                "block": "exchangerateconfig",
                                "permission": "AUTH_CUSTOMER_READ",
                            },
                        ]
                    },
                ]
            },
            {
                "_id": 'oline_shop_management',
                "pid": 0,
                "text": i18n.getKey('网店管理'),
                "leaf": false,
                "expanded": true,//标识改节点需要展开
                "permission": "AUTH_OLINE_SHOP_MANAGEMENT_READ",
                "items": [
                    {
                        "_id": 'profit_management',
                        "pid": 0,
                        "text": i18n.getKey('盈余管理'),
                        "leaf": false,
                        "expanded": true,//标识改节点需要展开
                        "permission": "AUTH_LANGUAGE_READ",
                        "items": [
                            {
                                "_id": 'qpmn_profit_check',
                                "text": i18n.getKey('QPMN盈余总览'),
                                "leaf": true,
                                "url": "profitmanagement/qpmn_profit_check",
                                "block": "qpmn_profit_check",
                                "permission": "AUTH_CUSTOMER_READ",
                            },
                            {
                                "_id": 'monthly_profit_case',
                                "text": i18n.getKey('每月盈余情况'),
                                "leaf": true,
                                "url": "profitmanagement/monthly_profit_case",
                                "block": "monthly_profit_case",
                                "permission": "AUTH_CUSTOMER_READ",
                            },
                            {
                                "_id": 'partner_profit_check',
                                "text": i18n.getKey('Partner盈余总览'),
                                "leaf": true,
                                "url": "profitmanagement/partner_profit_check?isHideMsg=true",
                                "block": "partner_profit_check",
                                "permission": "AUTH_CUSTOMER_READ",
                            },
                        ]
                    },
                    {
                        "_id": 'customer_order_management',
                        "pid": 0,
                        "text": i18n.getKey('Customer订单'),
                        "leaf": false,
                        "expanded": true,//标识改节点需要展开
                        "permission": "AUTH_LANGUAGE_READ",
                        "items": [
                            {
                                "_id": 'customer_order_management',
                                "text": i18n.getKey('Customer订单'),
                                "leaf": true,
                                "url": "customerordermanagement/main",
                                "block": "customer_order_management",
                                "permission": "AUTH_CUSTOMER_READ",
                            },
                            {
                                "_id": 'custormer_order_refund',
                                "text": i18n.getKey('Customer订单退款申请'),
                                "leaf": true,
                                "url": "custormer_order_refund/main",
                                "block": "custormer_order_refund",
                                "permission": "AUTH_CUSTOMER_READ",

                            }
                        ]
                    }
                ]
            },
            {
                "_id": 151,
                "text": "partner manager",
                "leaf": false,
                permission: 'AUTH_PARTNER_READ',
                items: [
                    {
                        "_id": 152,
                        "text": "partner",
                        "leaf": true,
                        "url": "partner/main",
                        "block": "partner",
                        "permission": "AUTH_PARTNER_READ",
                    },
                    /*    {
                            "_id": 29724920,
                            "text": "partner(unaudited)",
                            "leaf": true,
                            "url": "partnerv2/main",
                            "block": "partner(unaudited)",
                            "permission": "AUTH_PARTNER(UNAUDITED)_READ",
                        },
                        {
                            "_id": 167,
                            "text": "PartnerApply",
                            "leaf": true,
                            "url": "partnerapplys/partnerapplys",
                            "block": "partnerapplys",
                            "permission": "AUTH_PARTNERAPPLYS_READ",
                        },*/
                    {
                        "_id": '信贷',
                        "text": "信贷",
                        "leaf": false,
                        permission: 'AUTH_PARTNER_READ',
                        expanded: true,
                        items: [
                            {
                                "_id": '信贷管理',
                                "text": "信贷管理",
                                "leaf": true,
                                "url": "partner_credit/main",
                                "block": "partner_credit",
                                "permission": "AUTH_PARTNER_READ",
                            },
                            {
                                "_id": '信贷管理(待审核)',
                                "text": "信贷管理(待审核)",
                                "leaf": true,
                                "url": "partner_credit/main2",
                                "block": "partner_credit2",
                                "permission": "AUTH_PARTNER_READ",
                            },
                        ]
                    },
                    {
                        "_id": '账单',
                        "text": "账单",
                        "leaf": false,
                        expanded: true,
                        permission: 'AUTH_PARTNER_READ',
                        items: [
                            {
                                "_id": '延后付款账单',
                                "text": "延后付款账单",
                                "leaf": true,
                                "url": "partner_bill/main",
                                "block": "partner_bill",
                                "permission": "AUTH_PARTNER_READ",
                            },
                            {
                                "_id": '延后付款账单(待结算)',
                                "text": "延后付款账单(待结算)",
                                "leaf": true,
                                "url": "partner_bill/main?posted=true&paid=false&isCancel=false",//
                                "block": "partner_bill2",
                                "permission": "AUTH_PARTNER_READ",
                            },
                        ]
                    },
                    {
                        "_id": 191,
                        "text": "partnerOrderNotifyHistory",
                        "leaf": true,
                        "url": "partnerordernotifyhistory/partnerordernotifyhistory",
                        "block": "partnerordernotifyhistory",
                        "permission": "AUTH_PARTNERORDERNOTIFYHISTORY_READ",
                    },
                    {
                        "_id": 338153,
                        "text": "partnerApplyResultEmailConfig",
                        "leaf": true,
                        "url": "partnerapplyresultemailconfig/partnerapplyresultemailconfig",
                        "block": "partnerapplyresultemailconfig",
                        "permission": "AUTH_PARTNERAPPLYRESULTEMAILCONFIG_READ",
                    },
                    {
                        "_id": 338154,
                        "text": "partner Store总览",
                        "leaf": true,
                        "url": "partner/partnerstorecheck/main",
                        "block": "partner_store_check",
                        "permission": "AUTH_PARTNER_READ",
                    },
                    {
                        "_id": '税资质',
                        "text": "税资质",
                        "leaf": false,
                        permission: 'AUTH_CUSTOMER_READ',
                        items: [
                            {
                                "_id": '税资质未审核',
                                "text": "税资质(未审核)",
                                "leaf": true,
                                "url": "vat/main?status=Pending",
                                "block": "vat_unchecked",
                                "permission": "AUTH_CUSTOMER_READ",
                            },
                            {
                                "_id": '税资质已审核',
                                "text": "税资质(已审核)",
                                "leaf": true,
                                "url": "vat/main?status=Valid,Invalid",
                                "block": "vat_checked",
                                "permission": "AUTH_CUSTOMER_READ",
                            },
                        ]
                    },
                    {
                        "_id": '美国税豁免证明',
                        "text": "美国税豁免证明",
                        "leaf": false,
                        permission: 'AUTH_PARTNERAPPLYS_READ',
                        items: [
                            {
                                "_id": '美国税豁免证明未审核',
                                "text": "美国税豁免证明(未审核)",
                                "leaf": true,
                                "url": "USExemptionCert/main?status=Pending",
                                "block": "USExemptionCert",
                                "permission": "AUTH_PARTNERAPPLYS_READ",
                            },
                            {
                                "_id": 'USExemptionCert',
                                "text": "美国税豁免证明(已审核)",
                                "leaf": true,
                                "url": "USExemptionCert/main?status=Valid,Invalid,Remove",
                                "block": "USExemptionCert",
                                "permission": "AUTH_PARTNERAPPLYS_READ",
                            },
                        ]
                    }
                ]
            },
            {
                _id: 'costAudit',
                text: i18n.getKey('costAudit'),
                leaf: false,
                permission: 'AUTH_CUSTOMER_READ',
                items: [
                    {
                        _id: 338154,
                        block: "cost",
                        text: i18n.getKey('costAudit'),
                        url: "cost/main",
                        leaf: true,
                        permission: 'AUTH_CUSTOMER_READ',
                    },
                ]
            },
            {
                _id: 'tools',
                text: 'tools',
                leaf: false,
                permission: 'AUTH_SYNCCONFIGDATA_READ',
                items: [
                    {
                        _id: 22378465,
                        text: "syncConfigData",
                        leaf: true,
                        url: "tools/app/view/pushConfigData",
                        block: "syncconfigdata",
                        permission: "AUTH_SYNCCONFIGDATA_READ",
                    },
                    {
                        _id: 25314330,
                        block: "JsonPath",
                        text: 'JsonPath',
                        url: "tools/jsonpath",
                        permission: 'AUTH_CUSTOMER_READ',
                        leaf: true
                    },
                    {
                        _id: 25314330,
                        block: "JsonPath",
                        text: 'JsonEditor',
                        url: "tools/jsoneditor/main",
                        permission: 'AUTH_CUSTOMER_READ',
                        leaf: true
                    },
                    {
                        "block": "freemarktemplate",
                        "text": "freemarker",
                        "url": "tools/freemark/main",
                        "leaf": true,
                        "permission": "AUTH_PRODUCT_READ"
                    },
                    {
                        "block": "link",
                        "text": i18n.getKey("相关网站链接"),
                        "url": "tools/links/main",
                        "leaf": true,
                        "permission": "AUTH_PRODUCT_READ"
                    },
                    {
                        "block": "placeholder",
                        "text": i18n.getKey("placeholder"),
                        "url": "tools/placeholder",
                        "leaf": true,
                        "permission": "AUTH_PRODUCT_READ"
                    },
                    {
                        "_id": 25906345,
                        "text": "valueExValid",
                        "leaf": true,
                        "url": "tools/valueexvalid/main",
                        "block": "fileupload",
                        "permission": "AUTH_CUSTOMER_READ",

                    },
                    {
                        "_id": 26118128,
                        "text": "fileManage",
                        "leaf": true,
                        "url": "tools/fileupload",
                        "block": "fileupload",
                        "permission": "AUTH_CUSTOMER_READ",
                    },
                    {
                        "_id": 26118129,
                        "text": "下载订单预览图",
                        "leaf": true,
                        "url": "tools/downloadimage",
                        "block": "downloadimage",
                        "permission": "AUTH_CUSTOMER_READ",
                    },
                    {
                        "_id": 37114006,
                        "text": "服务器文件查看",
                        "leaf": true,
                        "url": "tools/checkserverfile",
                        "block": "tools",
                        "permission": "AUTH_CUSTOMER_READ",
                    },
                    {
                        "block": "createPathFile",
                        "text": i18n.getKey("dynamicSize服务工具"),
                        "url": "tools/createPathFile/main",
                        "leaf": true,
                        "permission": "AUTH_PRODUCT_READ"
                    },
                    {
                        "block": "dynamicSizeSmallVersionTest",
                        "text": i18n.getKey("刀线模板测试工具"),
                        "url": "dynamicsizesmallversiontest/main",
                        "leaf": true,
                        "permission": "AUTH_PRODUCT_READ"
                    },
                    {
                        "_id": 37114007,
                        "text": "表达式模板",
                        "leaf": true,
                        "url": "tools/expressiontemplate/expressiontemplate",
                        "block": "tools",
                        "permission": "AUTH_CUSTOMER_READ",
                    },
                    {
                        "_id": 37114008,
                        "text": "网站配置",
                        "leaf": true,
                        "url": "tools/websiteconfig/main",
                        "block": "tools",
                        "permission": "AUTH_CUSTOMER_READ",
                    },
                    //角色 backEndManager才可以访问
                    {
                        "_id": 37114010,
                        "text": "后台参数",
                        "leaf": true,
                        "url": "tools/backendsystemconfig/main",
                        "block": "tools",
                        "permission": "AUTH_BACKENDMANAGER_READ",
                    },
                    {
                        "_id": 37114011,
                        "text": "产品同步记录",
                        "leaf": true,
                        "url": "tools/productsynclog/main",
                        "block": "tools",
                        "permission": "AUTH_CUSTOMER_READ",
                    }
                ]
            },
        ]
    }
})

