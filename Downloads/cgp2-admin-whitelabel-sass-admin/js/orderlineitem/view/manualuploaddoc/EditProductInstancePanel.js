/**
 * 两个模式
 * 一个是上传用户设计
 * 修改用户设计
 *
 */
Ext.define("CGP.orderlineitem.view.manualuploaddoc.EditProductInstancePanel", {
    extend: "Ext.panel.Panel",
    //title: i18n.getKey(''),
    region: 'center',
    width: '65%',
    minWidth: 250,
    state: 'initial',
    itemId: 'editProductInstanceBuilder',
    mode: 'uploadUserDesign',
    // uploadUserDesign上传用户设计文档，
    // changeUserDesign更改用户设计，是两相似但不相同的功能，更改用户设计，需要额外参数orderLineItemUploadStatus
    //split: true,
    //collapsible: true,
    initComponent: function () {
        // 2025.11.25 xiu 给修改用户设计与查看用户设计的iframe地址加一个参数 themes=qpmn
        // 2025.11.26 xiu 需版本>=5时加 themes=qpmn 老版本不兼容
        var vm = this,
            controller = Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'),
            isGreaterFiveVersion = controller.getRegularIsGreaterFiveVersion(vm.builderUrl),
            themesParams = isGreaterFiveVersion ? '&themes=qpmn' : '',
            newUrl = location.origin + vm.builderUrl + `?productInstanceId=${vm.productInstanceId}${themesParams}`;

        vm.html = '<iframe style="overflow-y: scroll;overflow-x: scroll;" id="tabs_iframe_' + 'editProductInstance' +
            '" src="' + newUrl +
            '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>';
        //me.items = [];
        var iwindow;

        window.builder = {
            api: {
                "initialized": function (builderConfig) {

                    //獲取開發者token給builder
                    builderConfig.partnerToken = {
                        access_token: Ext.util.Cookies.get('token'),
                        token_type: "bearer"
                    };
                    builderConfig.showMask = true;
                    return builderConfig;
                },
                "loaded": loaded
            }
        };

        /*  function loaded() {
              //获取到builder window;
              iwindow = window.frames['tabs_iframe_editProductInstance'];
          };*/
        function loaded() {
            //获取到builder window;
            iwindow = window.frames['tabs_iframe_editProductInstance'].contentWindow
            if (iwindow.builder.addListener) {
                iwindow.builder.addListener("check-completed", ((data) => {
                    console.log(data.data)
                    vm.btn.setDisabled(false);
                }).bind(this));
            } else if (iwindow.builder.addListenerFunc) {
                iwindow.builder.addListenerFunc("check-completed", ((data) => {
                    console.log(data.data)
                    vm.btn.setDisabled(false);
                }).bind(this));
            }
        }

        function test(ProductInstanceApi, uploadStatus) {
            console.log("saveSuccess,productInstanceId:" + ProductInstanceApi._id);
            if (!Ext.isFunction(iwindow.builder.addListener)) {
                setTimeout(function () {
                    var url = adminPath + 'api/orderItems/' + vm.orderLineItemId + '/'
                        + ProductInstanceApi._id + '/productInstance?orderLineItemUploadStatus=' + uploadStatus + '&isUpdateOrderItemUploadStatus=true';
                    JSAjaxRequest(url, 'PUT', true, null, "修改成功", function (require, success, response) {
                        function callback(confirmCode) {
                            if (confirmCode == 'yes') {
                                JSOpen({
                                    id: 'modifyOrderStatus',
                                    url: path + 'partials/order/status.html?id=' + vm.order._id + '&isRedo=' + vm.order.isRedo + '&statusId=' + vm.order.status.id,
                                    title: i18n.getKey('order') + ' ' + i18n.getKey('modifyStatus'),
                                    refresh: true
                                })
                            }
                        }

                        if (uploadStatus == 'Uploaded') {
                            Ext.Msg.confirm('提示', '保存成功，是否跳转至修改订单状态页面？', callback);
                        } else {
                            Ext.Msg.confirm('提示', '保存成功，是否跳转至修改订单状态页面？', callback);
                        }
                        vm.win.close();
                    });
                    JSSetLoading(false);
                }, 100);
            }
        };
        vm.saveProductInstance = function (uploadStatus, btn) {
            btn.setDisabled(true);
            if (iwindow) {
                if (iwindow) {
                    iwindow.builder.saveProductInstance({
                        callback: function (ProductInstanceApi) {
                            test(ProductInstanceApi, uploadStatus);
                        },
                        instanceName: "instance-test",
                        needCompleted: false
                    });
                }
            }
        };
        vm.tbar = [
            {
                text: '保存修改',
                disabled: vm.editOrPreview == 'preview',
                hidden: vm.mode == 'changeUserDesign',
                handler: function (btn) {
                    vm.btn = btn;
                    Ext.Msg.show({
                        title: '确认窗口',
                        msg: '上传设计文档状态？',
                        width: 300,
                        buttons: Ext.MessageBox.YESNOCANCEL,
                        buttonText: {
                            yes: '已完成',
                            no: '部分完成',
                            cancel: '继续编辑'
                        },
                        fn: callback,
                    });

                    function callback(id) {
                        if (id === 'yes') {
                            vm.saveProductInstance('Uploaded', btn);
                        } else if (id === 'no') {
                            vm.saveProductInstance('PartialUpload', btn);
                        }
                    }
                }
            },
            {
                text: '保存修改',
                disabled: vm.editOrPreview == 'preview',
                hidden: vm.mode != 'changeUserDesign',
                handler: function (btn) {
                    vm.btn = btn;
                    Ext.Msg.show({
                        title: '确认窗口',
                        msg: '修改用户设计？',
                        width: 300,
                        buttons: Ext.MessageBox.YESNO,
                        buttonText: {
                            yes: '已完成',
                            no: '继续编辑'
                        },
                        fn: callback,
                    });

                    function callback(id) {
                        if (id === 'yes') {
                            vm.saveProductInstance('', btn);
                        }
                    }
                }
            }
        ];
        vm.callParent(arguments);
        //vm.mask = vm.setLoading('请选择PC!');
    }

});
