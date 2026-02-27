/**
 * @Description:
 * @author nan
 * @date 2022/11/7
 */
Ext.define('CGP.common.typesettingschedule.view.FileColumn', {
    extend: 'Skirtle.grid.column.Component',
    alias: 'widget.filecolumn',
    getDisplayName: null,
    initComponent: function () {
        var me = this;
        me.callParent();
    },
    signal: null,
    renderer: function (value, metaData, record) {
        var column = arguments[1].column,
            controller = Ext.create('CGP.common.typesettingschedule.controller.Controller');
        if (value) {
            return {
                xtype: 'container',
                width: '100%',
                value: value,
                layout: 'column',
                items: [
                    {
                        xtype: 'button',
                        iconCls: 'icon_copy',
                        itemId: 'copyBtn',
                        componentCls: 'btnOnlyIconV2',
                        ui: 'default-toolbar-small',
                        width: 30,
                        margin: '0px 5px',
                        tooltip: '复制路径',
                        handler: function (btn, Msg) {
                            const range = document.createRange();
                            var dom = btn.ownerCt.getComponent('url').el.query('div')[0];
                            range.selectNode(dom); //获取复制内容的 id 选择器
                            const selection = window.getSelection();  //创建 selection对象
                            if (selection.rangeCount > 0) selection.removeAllRanges(); //如果页面已经有选取了的话，会自动删除这个选区，没有选区的话，会把这个选取加入选区
                            selection.addRange(range); //将range对象添加到selection选区当中，会高亮文本块
                            document.execCommand('copy'); //复制选中的文字到剪贴板
                            Msg && Ext.Msg.alert('prompt', '复制成功');
                        }
                    },
                    {
                        xtype: 'button',
                        iconCls: 'icon_create_path',
                        componentCls: 'btnOnlyIconV2',
                        ui: 'default-toolbar-small',
                        width: 30,
                        tooltip: '下载图片',
                        hidden: column.signal === 'DistributeGenerateDetailPanel',
                        handler: function (btn) {
                            const imageUrl = composingPath + 'api/shareFiles/download?url=' + replaceBackslashes(value);

                            function replaceBackslashes(str) {
                                return str.replace(/\\/g, '%5C');
                            }

                            function downloadFileFromTalendAPI(fileUrl) {
                                const headers = {
                                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                };

                                fetch(fileUrl, {headers})
                                    .then(response => response.blob())
                                    .then(blob => {
                                        function getExtensionCharacters(filePath) {
                                            var extensionIndex = filePath.lastIndexOf('.');
                                            if (extensionIndex !== -1 && extensionIndex < filePath.length - 1) {
                                                var extensionCharacters = filePath.substr(extensionIndex + 1);
                                                return extensionCharacters;
                                            }
                                            return '';
                                        }

                                        const url = URL.createObjectURL(blob);
                                        const contentType = getExtensionCharacters(value);
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.download = contentType === 'pdf' ? 'download.pdf' : 'download.svg';
                                        link.click();
                                        URL.revokeObjectURL(url);
                                    })
                                    .catch(error => {
                                        console.error(error);
                                    });
                            }

                            downloadFileFromTalendAPI(imageUrl);
                        }
                    },
                    {
                        xtype: 'component',
                        itemId: 'url',
                        html: column.getDisplayName ? column.getDisplayName(value, metaData, record) : value,
                        columnWidth: 0.8
                    }
                ]
            }
        }
    }
})