/**
 * @author nan
 * @date 2026/1/26
 * @description TODO
 */
Ext.Loader.syncRequire([
    'CGP.common.stepv2.StepBarV2',
])
Ext.define('CGP.partner_credit.controller.Controller', {
    showCreateCreditWin: function () {
        var controller = this;
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            layout: 'fit',
            title: '选择Partner',
            items: [
                {
                    xtype: 'errorstrickform',
                    width: 450,
                    itemId: 'form',
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center'
                    },
                    items: [
                        {
                            xtype: 'partner_grid_combo',
                            width: '100%',
                            itemId: 'partnerId',
                            name: 'partnerId',
                            fieldLabel: 'Partner',
                            allowBlank: false,
                            margin: '5 25',
                            valueType: 'recordData',//recordData,idReference,id为可选的值类型
                        }
                    ]
                }
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                nextStepBtnCfg: {
                    hidden: false,
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var form = win.getComponent('form');
                        if (form.isValid()) {
                            var partnerData = form.getComponent('partnerId').getArrayValue();
                            var partnerId = partnerData.id;
                            var partnerName = partnerData.name;
                            //判断该partner的信贷配置是否存在
                            var configs = controller.getPartnerCredit(partnerId);
                            var isValid = true;
                            //['Pending', 'Valid', 'Invalid', 'Remove'],
                            var configId = '';
                            configs.map(function (item) {
                                //如果有启用和，待审核，则不能再新建
                                if (Ext.Array.contains(['Pending', 'Valid'], item.status)) {
                                    isValid = false;
                                    configId = item._id;
                                }
                            });
                            if (isValid == false) {
                                Ext.Msg.alert('提示', `Partner(${partnerId})已经存在对应的信贷配置(${configId}) ,无需新建!`);
                            } else {
                                JSOpen({
                                    id: 'partner_credit_edit',
                                    url: path + 'partials/partner_credit/edit.html' +
                                        '?partnerId=' + partnerId +
                                        '&action=' + 'create' +
                                        '&partnerName=' + partnerName +
                                        '&status=Pending',
                                    title: i18n.getKey('create') + '_' + 'partner信贷配置',
                                    refresh: true
                                });
                            }
                        }
                    }
                },
                saveBtnCfg: {
                    hidden: true,
                }
            }
        });
        win.show();
    },
    /**
     * 获取指定partnerId的信贷
     */
    getPartnerCredit: function (partnerId) {
        var result = [];
        var url = adminPath + 'api/partner/credit?page=1&start=0&limit=25' +
            `&filter=[{"name":"partner.id","value":"${partnerId}","type":"number"}]`;
        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    if (responseText.data.content && responseText.data.content.length > 0) {
                        result = responseText.data.content;
                    }
                }
            }
        }, true);
        return result;
    },
    /**
     * 信贷额度变化大的流水记录
     */
    getCreditTransaction: function (partnerId) {
        var url = adminPath + `api/partner/${partnerId}/credit/transaction?page=1&start=0&limit=25`;
        var result = [];
        JSAjaxRequest(url, "GET", false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    result = responseText.data.content;
                }
            }
        });
        return result;
    },

    /**
     * 查看指定的信贷记录的信贷统计
     */
    showCreditCount: function (partnerId) {
        var url = adminPath + `api/partner/${partnerId}/credit/account`;
        JSAjaxRequest(url, "GET", true, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    var data = responseText.data;
                    var json = {
                        "partner名称": data.partnerName,
                        "partnerId": data.partnerId,
                        "货币": data.currencyCode,
                        "当前应收款(USD)": data.receivableNum,
                        "管理信贷额(USD)": data.creditLimit,
                        "已使用管理信贷额(USD)": data.usedCreditLimit,
                        "可使用管理信贷额(USD)": data.leftCreditLimit,
                        "风险信贷额(USD)": data.riskCreditLimit,
                        "已使用风险信贷额(USD)": data.usedRiskCreditLimit,
                        "可使用风险信贷额(USD)": data.leftRiskCreditLimit
                    };
                    var arr = [];
                    for (var i in json) {
                        arr.push({
                            display: i,
                            value: json[i]
                        });
                    }
                    var store = Ext.create('Ext.data.Store', {
                            fields: [
                                'display', 'value'
                            ],
                            data: arr
                        }
                    );
                    var win = Ext.create('Ext.window.Window', {
                        modal: true,
                        constrain: true,
                        title: '信贷额统计',
                        layout: 'fit',
                        items: [
                            {
                                xtype: 'grid',
                                width: 500,
                                tbar: [
                                    {
                                        xtype: 'button',
                                        text: '信贷额流水',
                                        iconCls: 'icon_check',
                                        handler: function () {
                                            JSOpen({
                                                id: 'credit_transaction_page',
                                                url: path + `partials/partner_credit/main3.html?partnerId=${partnerId}`,
                                                refresh: true,
                                                title: `信贷额度流水(Partner:${partnerId})`
                                            });
                                        }
                                    }
                                ],
                                columns: [
                                    {
                                        dataIndex: 'display',
                                        text: '属性',
                                        flex: 1,
                                    },
                                    {
                                        dataIndex: 'value',
                                        text: '值',
                                        flex: 1
                                    }
                                ],
                                store: store
                            }
                        ],
                    });
                    win.show(null, function () {
                        var me = this;
                        me.center();
                    });
                }
            }
        }, true);
    },

    /**
     * 审核信贷申请
     */
    auditPartnerCredit: function (creditId, audit, record) {
        var title = '审核通过，备注信息';
        var action = 'edit';
        var status = 'Valid';
        if (audit == false) {
            title = '审核不通过，备注信息';
            action = 'read';
            status = 'Invalid';
        }
        var win = Ext.create('Ext.window.Window', {
            title: title,
            modal: true,
            constrain: true,
            layout: 'fit',
            width: 450,
            height: 150,
            items: [
                {
                    xtype: 'textarea',
                    itemId: 'remark',
                    name: 'remark',
                    fieldLabel: '备注',
                    margin: '5 25',
                    labelWidth: 50,
                    allowBlank: false,
                }
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var remark = win.getComponent('remark');
                        if (remark.isValid()) {
                            var url = adminPath + `api/partner/credit/audit/${creditId}?audit=${audit}&remark=${remark.getValue()}`;
                            var jsonData = record.getData();
                            var id = jsonData.id;
                            JSAjaxRequest(url, 'PUT', true, jsonData, null, function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success) {
                                        var newConfig = responseText.data;
                                        var partnerId = newConfig.partner.id;
                                        var id = newConfig._id;
                                        Ext.Msg.alert('提示', `审核完成`, function () {
                                            var newUrl = path + `partials/partner_credit/edit.html?partnerId=${partnerId}&id=${id}&action=${action}&status=${status}`;
                                            window.location.href = newUrl;
                                        });
                                    }
                                }
                            }, true);
                        }
                    }
                }
            }
        });
        win.show();
    },
    /**
     * 显示信贷信息修改记录
     */
    getCreditLog: function (partnerId) {
        var url = adminPath + `api/partner/${partnerId}/credit/changeLog?page=1&start=0&limit=1000`;
        var result = [];
        JSAjaxRequest(url, "GET", false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    result = responseText.data.content;
                }
            }
        }, true);
        return result;
    },
    /**
     * 修改历史
     */
    showModifyLog: function (partnerId) {
        var controller = this;
        var configs = controller.getCreditLog(partnerId);
        var map = {
            'address': '地址',
            'email': '邮件',
            'partnerName': "partner名称",
            'partnerId': "partnerId",
            'customerAbbreviation': '客户名称',
            'customerEnName': '客户英文名',
            'currencyCode': "货币",
            'receivableNum': "当前应收款",
            'creditLimit': "管理信贷额",
            'usedCreditLimit': "已使用管理信贷额",
            'leftCreditLimit': "可使用管理信贷额",
            'riskCreditLimit': "风险信贷额",
            'usedRiskCreditLimit': "已使用风险信贷额",
            'leftRiskCreditLimit': "可使用风险信贷额",
            'creditSummary': "信贷摘要",
            'creditDetail': "信贷明细",
            'paymentMethod': "付款方式",
            'status': '状态',
            'paymentTermDays': '付款期(天)',
            'gracePeriodDays': '宽限期(天)',
            'reviewDocs': '相关凭证'
        };
        var timeLine = configs;
        console.log(timeLine)
        var steps = [];
        timeLine.map(function (item) {
            var modifiedDate = Ext.Date.format(new Date(item.modifiedDate), 'Y-m-d H:i:s');
            var operator = item.userName;
            var afterChange = item.afterChange;
            var beforeChange = item.beforeChange;
            var compArr = [];
            for (var i in afterChange) {
                if (Ext.isEmpty(beforeChange[i])) {
                    beforeChange[i] = '';
                }
                if (Ext.isEmpty(afterChange[i])) {
                    afterChange[i] = '';
                }
                var map2 = {
                    Pending: '待审核',
                    Valid: '启用',
                    Invalid: '禁用',
                    Remove: '已删除',
                };
                if (map2[beforeChange[i]]) {
                    beforeChange[i] = map2[beforeChange[i]];
                }
                if (map2[afterChange[i]]) {
                    afterChange[i] = map2[afterChange[i]];
                }
                var str = `${beforeChange[i]} ==> <font  color="red">${afterChange[i]}</font>`;
                if (i == 'insuranceConfig') {
                    var after_insuranceConfig = afterChange[i];
                    var before_insuranceConfig2 = beforeChange[i];
                    for (var j in after_insuranceConfig) {
                        if (j == 'clazz') {

                        } else {
                            var str = `${before_insuranceConfig2[j]} ==> <font  color="red">${after_insuranceConfig[j]}</font>`;
                            compArr.push({
                                xtype: 'displayfield',
                                value: str,
                                labelWidth: 150,
                                labelAlign: 'right',
                                fieldLabel: map[j] ? map[j] : j,
                                width: 450,
                            });
                        }
                    }
                } else if (i == 'reviewDocs') {
                    var afterReviewDocs = afterChange[i];
                    var beforeReviewDocs = beforeChange[i];
                    if (beforeReviewDocs?.length > 0) {
                        var images = [];
                        beforeReviewDocs.map(function (image) {
                            var fileName = image;
                            var fileType = fileName.split('.').pop();
                            var imageUrl = imageServer + fileName;
                            if (fileType.toUpperCase() == 'PDF') {//处理pdf文件的情况
                                //转为png后缀
                                //https://dev-sz-qpson-nginx.qppdev.com/file/file/payment/transactionVouchers/2d40a02fbacc6c96e2f2982f89591fa1.png
                                imageUrl = imageUrl.replace(/.pdf|.PDF/g, '.png');
                            }
                            images.push({
                                xtype: 'imagedisplayfield',
                                src: imageUrl
                            });
                        });
                        compArr.push({
                            xtype: 'fieldcontainer',
                            defaults: {
                                margin: 5,
                            },
                            bodyStyle: {
                                backgroundColor: 'red'
                            },
                            fieldLabel: '旧相关凭证',
                            autoScroll: true,
                            width: 450,
                            layout: 'hbox',
                            items: images
                        });
                    }

                    if (afterReviewDocs?.length > 0) {
                        var images = [];
                        afterReviewDocs.map(function (image) {
                            var fileName = image;
                            var fileType = fileName.split('.').pop();
                            var imageUrl = imageServer + fileName;
                            if (fileType.toUpperCase() == 'PDF') {//处理pdf文件的情况
                                //转为png后缀
                                //https://dev-sz-qpson-nginx.qppdev.com/file/file/payment/transactionVouchers/2d40a02fbacc6c96e2f2982f89591fa1.png
                                imageUrl = imageUrl.replace(/.pdf|.PDF/g, '.png');
                            }
                            images.push({
                                xtype: 'imagedisplayfield',
                                src: imageUrl
                            });
                        });
                        compArr.push({
                            xtype: 'fieldcontainer',
                            defaults: {
                                margin: 5,
                            },
                            fieldLabel: '新相关凭证',
                            autoScroll: true,
                            width: 450,
                            layout: 'hbox',
                            items: images
                        });
                    }

                } else {
                    compArr.push({
                        xtype: 'displayfield',
                        value: str,
                        labelWidth: 150,
                        labelAlign: 'right',
                        fieldLabel: map[i] ? map[i] : i,
                        width: 450,
                    });
                }
            }
            var stepItem = {
                xtype: 'step_item_container',
                stepTitleConfig: {
                    xtype: 'container',
                    border: '2',
                    width: 500,
                    style: {
                        color: 'silver',
                        border: 'solid'
                    },
                    margin: 5,
                    layout: {
                        type: 'vbox',
                        align: 'top'
                    },
                    defaults: {
                        flex: 1,
                    },
                    items: [
                        {
                            xtype: 'displayfield',
                            width: 500,
                            value: `<font style="white-space:normal;font-weight: bold">操作日期：${modifiedDate}</font><br>` +
                                ` <font style="white-space:normal;font-weight: bold">操作人：${operator}</font>`,
                        },
                        {
                            xtype: 'container',
                            name: 'extraInfo',
                            itemId: 'extraInfo',
                            margin: '0 5',
                            layout: {
                                type: 'vbox',
                                align: "center",
                                pack: 'center'
                            },
                            width: 450,
                            defaults: {
                                margin: '0 0',
                                fieldStyle: {
                                    textAlign: 'left'
                                }
                            },
                            items: compArr,
                        },
                    ]
                },
                stepItemV2Config: {},
            };
            steps.push(stepItem);
        });
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            title: '修改历史',
            constrain: true,
            autoScroll: true,
            width: 650,
            maxHeight: 600,
            layout: 'auto',
            items: [
                {
                    xtype: 'step_bar_v2',
                    layout: 'vbox',
                    direct: 'vbox',
                    allowItemClick: true,
                    margin: '5 25',
                    width: '90%',
                    allowClickChangeProcess: false,
                    defaults: {},
                    stepItemContainerArr: steps,
                },
            ]
        });
        win.show();
    },
    savePartnerCredit: function (model, form) {
        var data = model.getData();
        var method = 'POST';
        if (Ext.isEmpty(data._id)) {
            var url = adminPath + `api/partner/${JSGetQueryString('partnerId')}/credit`;
        } else {
            method = 'PUT';
            var url = adminPath + `api/partner/credit/${data._id}`;
        }
        JSAjaxRequest(url, method, true, data, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    var newModel = new CGP.partner_credit.model.PartnerCreditModel(responseText.data);
                    form.loadModel(newModel);
                    var uxEditForm = form.owner.ownerCt;
                    var mainPageId = uxEditForm.block + 'page';//管理页面的id
                    var editPageId = uxEditForm.block + '_edit';//管理页面的id
                    var tabs = top.Ext.getCmp(uxEditForm.outTabsId);
                    if (tabs) {
                        var editPage = tabs.getComponent(editPageId);
                        if (editPage) {
                            var title = `修改_Partner信贷配置(${responseText.data._id})`;
                            editPage.setTitle(title);
                            var arr = top.document.getElementById('tabs_iframe_partner_creditpage')?.contentWindow?.Ext?.ComponentQuery?.query('[xtype=uxgridpage]');
                            if (arr && arr[0]) {
                                //arr[0].grid.store.load()
                            }
                        }
                    }

                }
            }
        }, true);
    },
    /**
     * 显示配置帮助
     */
    showConfigHelp: function () {
        var str = '规则1 Partner所有未结算的订单总金额超过风险信贷额,则不允许生成新订单<br>' +
            '规则2 Partner所有已发货，但未结算订单总金额超过管理信贷额,则超过的新订单会被锁定,不允许修改状态<br>' +
            '规则3 订单签收后，超过设置的付款期和宽限期后,还未付款,该订单即为逾期未付款订单<br>' +
            '规则4 如果该Partner有逾期未付款的订单,允许Parner下单，但是所有订单会被锁定，不允修改状态<br>' +
            '规则5 当一个Partner的信贷配置生效后,该Parnter的付款方式自动改为延后付款<br>' +
            '规则6 订单生成时的锁定状态根据风险信贷额度进行判断<br>';
        var win = Ext.create('Ext.window.Window', {
            title: '配置相关说明',
            width: 650,
            height: 250,
            modal: true,
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'component',
                    width: 600,
                    html: `<div style="text-align: center;"><font style="font-weight: bold;font-size: 16px">${str}</font><div>`
                }
            ]
        });
        win.show();

    }
})