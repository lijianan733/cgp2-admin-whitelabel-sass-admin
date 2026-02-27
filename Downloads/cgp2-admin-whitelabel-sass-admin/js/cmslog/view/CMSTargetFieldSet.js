/**
 * @Description:
 * @author nan
 * @date 2023/5/25
 */
Ext.Loader.syncRequire([
    'CGP.cmslog.view.SpecialTextField'
])
Ext.define('CGP.cmslog.view.CMSTargetFieldSet', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.cms_target_fieldset',
    title: "<font style='color: green;  font-weight: bold'>发布参数配置</font>",
    layout: {
        type: 'vbox',
    },
    defaults: {
        width: '100%',
    },
    allowBlank: false,
    diyGetValue: function () {
        var me = this;
        var params = me.getComponent('params');
        var data = params.getValue();
        var targetEnvStatus = me.getComponent('targetEnvStatus');
        var websiteConfig = me.getComponent('websiteConfig');
        data.targetEnvStatus = targetEnvStatus.getValue();
        data.websiteConfig = websiteConfig.diyGetValue();
        return data;
    },
    //数据存放到指定42616452中
    getTargetEnvConfig: function () {
        var targetEnvConfig = {};
        var url = adminPath + 'api/configurations/' + '42616452';
        JSAjaxRequest(url, 'GET', false, null, false, function (require, success, response) {
            if (success) {
                try {
                    var responseText = Ext.JSON.decode(response.responseText);
                } catch (e) {
                    Ext.Msg.alert('提示', '网站配置数据为非法JSON格式');
                    return;
                }
                if (responseText.success) {
                    var data = responseText.data;
                    targetEnvConfig = Ext.JSON.decode(data.value);
                }
            }
        });
        return targetEnvConfig;
    },
    initComponent: function () {
        var me = this;
        var targetEnv = [];
        var targetEnvConfig = me.getTargetEnvConfig();
        for (var i in targetEnvConfig) {
            targetEnv.push({
                value: i,
                display: i
            })
        }
        me.items = [
            {
                xtype: 'hiddenfield',
                itemId: 'websiteConfig',
                name: 'websiteConfig',
                allowBlank: true,
                rawData: null,
                diyGetValue: function () {
                    return this.rawData;
                }
            },
            {
                xtype: 'combo',
                itemId: 'targetEnv',
                name: 'targetEnv',
                fieldLabel: i18n.getKey('发布目标环境'),
                valueField: 'value',
                displayField: 'display',
                editable: false,
                allowBlank: false,
                readOnly: false,
                fieldStyle: 'background-color:white',
                store: {
                    xtype: 'store',
                    fields: [
                        'value', 'display'
                    ],
                    data: targetEnv
                },
                targetEnvConfig: targetEnvConfig,
                listeners: {
                    change: function (field, newValue, oldValue) {
                        JSSetLoading(true, '加载中...');
                        var config = field.targetEnvConfig[newValue];
                        var websiteConfig = field.ownerCt.getComponent('websiteConfig');
                        config.configTag = newValue;//标识使用那个配置来发布
                        websiteConfig.rawData = config;
                        setTimeout(function () {
                            var container = field.ownerCt;
                            var targetEnvStatus = container.getComponent('targetEnvStatus');
                            var targetEnvStatusValue = 'RELEASE';
                            var params = container.getComponent('params');
                            params.items.items.map(function (item) {
                                item.setValue(config[item.name]);
                            });
                            //如果70就不处理
                            //取选择的配置数据
                            //取接口数据
                            //进行判断，赋值，70的环境默认
                            //默认都是release
                            /*
                                publishCfgObj: {
                                    "jobName" : "/job/192.168.26.168-QP-Market-Network-CMS",
                                    "jenkinsParams" : "[{\"SITE_NAME\":\"qp-market-network\"}]",
                                    "sourceDir" : "/usr/local/deploy_trans_dir/test/qp-market-network/cms",
                                    "targetDir" : "/usr/local/deploy_trans_dir/test/qp-market-network/transition/",
                                    "targetEnv" : "QPMN",
                                    "jsonPath" : "$['qpmn2.0']",
                                    "tag" : "b",
                                },
                                sitePublishObj: {
                                    "qpmn2.0": { "Release" : "a", "Stage" : "b" }
                                }
                            */
                            /**
                             * @return {*} "Release" | "Stage"
                             */
                            if (/dev-sz-qpson-nginx.qppdev.com/.test(location.origin)) {
                                //70 直接都是Release
                                targetEnvStatus.setValue(targetEnvStatusValue);
                                JSSetLoading(false);
                            } else {
                                var checkUrl = config.checkUrl;
                                if (checkUrl) {
                                    var controller = Ext.create('CGP.cmslog.controller.Controller');
                                    controller.getTargetStatus(config, function (status) {
                                        //return isRelease ? "RELEASE" : "TEST";
                                        targetEnvStatus.setValue(status);
                                        JSSetLoading(false);
                                    });
                                } else {
                                    targetEnvStatus.setValue(targetEnvStatusValue);
                                    JSSetLoading(false);
                                }

                            }
                        }, 250);
                    },
                    afterrender: function () {
                        var me = this;
                        setTimeout(function () {
                            var model = me.getStore().getAt(0);
                            me.setValue(model.get('value'));
                        }, 500);
                    }
                },
            },
            {
                xtype: 'combo',
                fieldLabel: i18n.getKey('发布目标环境状态'),
                itemId: 'targetEnvStatus',
                name: 'targetEnvStatus',
                vertical: true,
                valueField: 'value',
                displayField: 'display',
                fieldStyle: 'background-color:silver',
                readOnly: true,
                store: {
                    xtype: 'store',
                    fields: ['value', 'display'],
                    data: [{
                        value: 'TEST',
                        display: 'STAGE'
                    }, {
                        value: 'RELEASE',
                        display: 'RELEASE'
                    }]
                },
                listeners: {
                    change: function (btn, newValue, oldValue) {
                        var publishConfirm = btn.ownerCt.getComponent('publishConfirm');
                        publishConfirm.setVisible(newValue == 'RELEASE');
                        publishConfirm.setDisabled(newValue != 'RELEASE');
                    }
                }
            },
            {
                xtype: 'checkbox',
                fieldLabel: '发布确认',
                allowBlank: false,
                boxLabel: '<font color="red" style="font-weight: bold">勾选此项确认我要在release环境发布这些页面，并且确认我已在stage环境测试过这些页面的正确性;' +
                    '<br>提示：发布完成后,请先自行检查发布的内容,并通知IT部人员进行测试;</font>',
                name: 'publishConfirm',
                itemId: 'publishConfirm',
                isValid: function (value) {
                    if (this.disabled == false && this.getValue() == false) {
                        return false;
                    } else {
                        return true;
                    }
                },
                getErrors: function (value) {
                    return '发布Release环境必须勾选该项';
                },
            },
            {
                xtype: 'uxfieldset',
                itemId: 'params',
                name: 'params',
                title: "<font style='color: green;  font-weight: bold'>发布参数配置</font>",
                layout: {
                    type: 'vbox',
                },
                defaults: {
                    width: '100%',
                    readOnly: true,
                    margin: '5 5 0 5',
                    fieldStyle: 'background-color:silver',
                },
                extraButtons: {
                    enableBtn: {
                        xtype: 'button',
                        margin: '0 0 0 5',
                        width: 80,
                        iconCls: 'icon_edit',
                        text: i18n.getKey('启用编辑'),
                        count: 0,
                        handler: function (btn) {
                            var params = btn.ownerCt.ownerCt;
                            if (btn.count % 2 == 0) {
                                params.items.items.map(function (field) {
                                    field.setReadOnly(false);
                                    field.setFieldStyle('background-color:white');
                                    btn.setText(i18n.getKey('禁用编辑'));
                                })
                            } else {
                                params.items.items.map(function (field) {
                                    field.setReadOnly(true);
                                    field.setFieldStyle('background-color:silver');
                                    btn.setText(i18n.getKey('启用编辑'));
                                })
                            }
                            btn.count++;
                        }
                    }
                },
                items: [
                    {
                        xtype: 'textarea',
                        margin: '10 5 0 5',
                        fieldLabel: i18n.getKey('jobName'),
                        name: 'jobName',
                        itemId: 'jobName',
                    },
                    {
                        xtype: 'textarea',
                        fieldLabel: i18n.getKey('jenkinsParams'),
                        name: 'jenkinsParams',
                        itemId: 'jenkinsParams',
                    },
                    {
                        xtype: 'textarea',
                        fieldLabel: i18n.getKey('sourceDir'),
                        name: 'sourceDir',
                        itemId: 'sourceDir',
                    },
                    {
                        xtype: 'textarea',
                        fieldLabel: i18n.getKey('targetDir'),
                        name: 'targetDir',
                        itemId: 'targetDir'
                    },
                    {
                        xtype: 'hiddenfield',
                        fieldLabel: i18n.getKey('targetEnv'),
                        name: 'targetEnv',
                        itemId: 'targetEnv'
                    },
                    {
                        //发布的页面网站地址
                        xtype: 'hiddenfield',
                        fieldLabel: i18n.getKey('websiteUrl'),
                        name: 'websiteUrl',
                        itemId: 'websiteUrl'
                    },
                    {
                        xtype: 'hiddenfield',
                        name: 'tag',
                        itemId: 'tag',
                        diyGetValue: function () {
                            var me = this;
                            return me.getValue() || null;
                        }
                    },
                ]
            },
        ];
        me.callParent(arguments);
    }
})
