/**
 * @Description:
 * @author nan
 * @date 2022/4/28
 */
Ext.define('CGP.cmslog.controller.Controller', {
    /**
     * 发布重试
     * @param publishRecordId 发布记录的Id
     *
     */
    publish: function (data) {
        var doRequire = function () {
            JSSetLoading(true);
            JSAjaxRequest(url, 'POST', true, data, false, function (require, success, response) {
                JSSetLoading(false);
                if (response.status == 200) {
                    var responseText = Ext.JSON.decode(response.responseText);
                    var recordId = responseText.data;
                    Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('是否查看发布结果'), function (selector) {
                        if (selector == 'yes') {
                            JSOpen({
                                id: 'CMSLog_detail',
                                url: path + 'partials/cmslog/edit.html?id=' + recordId,
                                title: i18n.getKey('CMSLog') + '(' + recordId + ')',
                                refresh: true
                            });
                        }
                    });
                } else {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请求接口失败'));
                }
            });
        };
        var url = adminPath + 'api/cms-saas/publish/v2';
        //保存时候的数据是字符串，但是接口返回的是0和1，需要兼容数据
        var statue = '';
        if (data.targetEnvStatus == 'RELEASE' || data.targetEnvStatus == 1) {
            statue = "Release";
        } else {
            statue = "Stage"
        }
        Ext.Msg.confirm('提示', `是否确定发布到<font color="red" style="font-weight: bold">${statue}</font>环境？`, function (selector) {
            if (selector == 'yes') {
                doRequire();
            }
        });
    },
    /**
     * 根据一条发布记录生成重新发布所需的数据
     * @param record
     */
    buildPublishData: function (record) {
        var data = Ext.clone(record.getData());
        return record.get('cmsPublishRequestSnapShot') || {
            "clazz": "com.qpp.cgp.domain.cms.record.CMSPublishRecord",
            "publishType": data.publishType,//发布的是产品类目，产品详情，普通页
            "selectionSources": data.selectionSources,//选择发布的配置，产品id，cms发布配置id
            "statusOfProduct": data.statusOfProduct,
            "jobName": data.jobName,
            "jenkinsParams": data.jenkinsParams,
            "sourceDir": data.sourceDir,
            "targetDir": data.targetDir,
            'targetEnvStatus': data.targetEnvStatus,
            'extraParams': data.extraParams,
            tag: data.tag,//标识a环境或者b环境，可以不填
            targetEnv: data.targetEnv,//QPMN QPSON
        }
    },
    /**
     *
     * @param view
     */
    publishPreview: function (view) {
        var controller = this;
        Ext.Msg.alert(i18n.getKey('prompt'), '开发中')
    },
    /**
     * 判断目标环境
     */
    judgeTargetEnv: function (data) {
        //明确知道目标环境
        var extraParams = data.extraParams;
        if (extraParams && extraParams.targetEnv) {
            return (extraParams.targetEnv).toUpperCase();
        } else {
            //以前没指定环境的根据targetDir目录来判断
            var targetDir = data.targetDir.toLowerCase();
            if (targetDir.indexOf('qpson') != -1) {
                return 'QPSON';
            } else if (targetDir.indexOf('qp-market') != -1) {
                return 'QPMN';
            } else {
                return 'QPSON';
            }
        }
    },
    /**
     *
     */
    getPublishConfig: function (form) {
        var win = form.ownerCt;
        var selectedRecordGrid = win.getComponent('selectedRecordGrid');
        var formData = form.getValue();
        var data = {
            "clazz": "com.qpp.cgp.domain.cms.record.CMSPublishRecord",
            "publishType": formData.publishType,
            "selectionSources": selectedRecordGrid.diyGetValue(),
            "statusOfProduct": formData.statusOfProduct,
            "targetEnvStatus": formData.targetEnvStatus || [],
            'extraParams': {
                targetEnv: null
            }
        };
        if (formData.otherConfig) {
            data = Ext.Object.merge(data, formData.otherConfig);
            data.extraParams = formData.otherConfig;
        }
        return data;
    },
    /**
     * 根据网站配置数据，判断发布的是stage还是release
     * config:{
     *     "jobName": "/job/192.168.26.149-QP-Market-Network-CMS",
     *     "jenkinsParams": "[{\"SITE_NAME\":\"qp-market-network\"},{\"SITE_PATH\":\"frontend-b\"}]",
     *     "sourceDir": "/usr/local/deploy_trans_dir/test/frontend-b/qp-market-network/cms",
     *     "targetDir": "/usr/local/deploy_trans_dir/test/frontend-b/qp-market-network/transition/",
     *     "targetEnv": "QPMN",
     *     "jsonPath": "$['qp-market-network']",
     *     "tag": "b",
     *     "checkUrl": "https://test-qpmn.qppdev.com/getVersion/switch_record",
     *     "websiteUrl": "https://test-qpmn.qppdev.com/",
     *     "stageUrl": "https://test-qpmn.qppdev.com/"
     * }
     */
    getTargetStatus: function (config, callback) {
        JSSetLoading(true);
        var checkUrl = config.checkUrl;
        var obtainSitePublishEnvironment = function (publishCfgObj, sitePublishObj) {
            function findByJsonPath(path, json) {
                return window.jsonpath.query(json, path);
            }

            function isArrayAndHasItem(target) {
                return Ext.isArray(target) && target.length > 0;
            }

            var sitePublishEnvObj;
            var isRelease;
            if (publishCfgObj.jsonPath) {
                sitePublishEnvObj = findByJsonPath(publishCfgObj.jsonPath, sitePublishObj);
                if (publishCfgObj.tag && isArrayAndHasItem(sitePublishEnvObj) &&
                    (publishCfgObj.tag == sitePublishEnvObj[0]["Release"] || publishCfgObj.tag == sitePublishEnvObj[0]["release"])
                ) {
                    isRelease = true;
                } else if (publishCfgObj.tag && isArrayAndHasItem(sitePublishEnvObj) &&
                    (publishCfgObj.tag == sitePublishEnvObj[0]["Stage"] || publishCfgObj.tag == sitePublishEnvObj[0]["stage"])
                ) {
                    isRelease = false;
                }
            }
            return isRelease ? "RELEASE" : "TEST";
        };

        checkUrl += '?id=' + JSGetUUID();
        var sitePublishObj = null;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", checkUrl);
        xhr.setRequestHeader('Accept', '*/*');
        xhr.send();

        xhr.addEventListener('load', function () {
            sitePublishObj = xhr.response;
            var targetEnvStatusValue = obtainSitePublishEnvironment(config, Ext.JSON.decode(sitePublishObj));
            callback(targetEnvStatusValue);
            JSSetLoading(false); // 请求成功后设置加载状态为 false
        });

        xhr.onerror = function (evt) {
            Ext.Msg.alert('提示', '获取接口数据失败！');
            JSSetLoading(false); // 请求失败后设置加载状态为 false
        };
    }
})