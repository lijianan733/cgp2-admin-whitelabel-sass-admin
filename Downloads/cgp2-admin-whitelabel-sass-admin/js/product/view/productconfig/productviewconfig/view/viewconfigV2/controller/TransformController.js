Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.controller.TransformController', {
    componentConfigTransform: function (componentConfigs) {
        var me = this;
        var navBarCompClazzList = [];
        var compDomainConfigs = [];
        Ext.Array.each(componentConfigs,function (componentConfig){
            if(Ext.Array.contains(navBarCompClazzList,componentConfig.clazz)){
                compDomainConfigs.push(me.navbarComponentConfigTransform(componentConfig))
            }else{
                compDomainConfigs.push(me.ordinaryCopmCfgTransform(componentConfig))
            }
        })
        return compDomainConfigs;
    },
    //导航组件类型配置转换
    navbarComponentConfigTransform: function (navbarCompConfig) {
        var navbarTamlates = [];
        return navbarCompConfig;

    },
    //一般组件类型配置转换
    ordinaryCopmCfgTransform: function (componentConfig) {
        return componentConfig;
    },
    /**
     * builderViewConfigDto转domain方法
     * @param dto
     * @constructor
     */
    DTOTransformDomain: function (dto) {
        var me = this;
        //clazz映射
        var clazzMap = {
            'dto': 'domain'
        }
        //domain模板
        var domain = {
            _id: dto.builderViewConfigDomain ? dto.builderViewConfigDomain._id : JSGetCommonKey(false),
            productConfigViewId: dto.productConfigViewId,
            clazz: 'com.qpp.cgp.domain.product.config.view.builder.config.OrdinaryBuilderViewConfig',
            editViewConfigs: [],
            componentConfigs: []
        };
        //替换普通信息
        domain.productConfigViewId = dto.componentConfigs;
        domain.clazz = clazzMap[dto.clazz];
        //editViewConfigs转换
        domain.editViewConfigs = me.transformEditViewConfigs(dto.editViewConfigs, domain);
        //componentConfigs转化
        domain.componentConfigs = me.componentConfigTransform(dto.componentConfigs);
    },
    //editViewConfigs转换
    transformEditViewConfigs: function (editViewConfigs, domain) {
        var me = this;
        var editViewDomainConfigs = [];
        Ext.Array.each(editViewConfigs, function (item) {
            var editViewConfig = {
                builderView: {
                    clazz: domain.clazz,
                    _id: domain._id
                },
                configs: [],
                editViewType: item.editViewType.editViewTypeDomain
            };
            Ext.Array.each(item.configs, function (editViewData) {
                editViewConfig.configs.push(me.editViewDataTransDomain(editViewData, item))
            })
            editViewDomainConfigs.push(editViewConfig)
        });
        return editViewDomainConfigs;

    },
    //editViewDataDto 转成组件
    editViewDataTransComp: function (editViewDataConfig, dtoOrDomainComp) {
        var localData = Ext.clone(editViewDataConfig);
        delete localData.componentPath;
        if (dtoOrDomainComp == 'dto') {

        }else{
            delete localData.navItemId;
        }
        return localData;
    },
    //editViewDataDto 转成editViewComponentDomain
    editViewDataTransDomain: function (editViewDataConfig, editViewConfig) {
        var me = this;
        var editViewComponent = {
            clazz: '',
            config: {},
            componentPath: ''
        }
        var localData = Ext.clone(editViewDataConfig);
        delete localData._id;
        //特殊处理。一下几种类型的数据用另一种clazz结构
        /*   H1 ： $.areas[?(@.position.layoutPosition=='H1')].components[0]
           H3 ： $.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='H3')]
           ToolTips ： $.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='ToolTips')]
           ToolBar ： $.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='ToolBar')]
           AssistBar ： $.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='AssistBar')]
           DocumentView ： $.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='DocumentView')]
           */

        if (localData.componentPath.clazz == 'com.qpp.cgp.domain.product.config.view.builder.config.NamePath') {

        } else {
            var FullPath = {
                "$.areas[?(@.position.layoutPosition=='H1')].components[?(@.name=='H1')]": "$.areas[?(@.position.layoutPosition=='H1')].components[0]",//这个配置是为了处理配置人员已经配置了的大量不兼容数据
                "$.areas[?(@.position.layoutPosition=='H1')].components[?(@.name=='H1NavBar')]": "$.areas[?(@.position.layoutPosition=='H1')].components[0]",
                "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='H3')]": "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='H3')]",
                "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='H4')]": "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='H4')]",
                "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='ToolTips')]": "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='ToolTips')]",
                "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='ToolBar')]": "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='ToolBar')]",
                "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='AssistBar')]": "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='AssistBar')]",
                "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='DocumentView')]": "$.areas[?(@.position.layoutPosition=='Document')].components[?(@.name=='DocumentView')]"
            };
            if (FullPath[localData.componentPath.path]) {
                //以上6种使用fullPath
                localData.componentPath.path = FullPath[localData.componentPath.path];

            } else {
                //其余情况使用namePath,把fullPath转成namePath
                var newPath = localData.componentPath.path.split("[?(@.name=='")[0];
                var newName = localData.componentPath.path.split("[?(@.name=='")[1];
                newName = newName.split("')]")[0];
                var namePath = {
                    clazz: 'com.qpp.cgp.domain.product.config.view.builder.config.NamePath',
                    name: newName,
                    path: newPath
                }
                localData.componentPath = namePath;
            }
        }
        localData = Ext.Object.merge(localData, {
            navItemId: editViewConfig.navItemId
        });
        editViewComponent.navItemId = editViewConfig.navItemId;
        editViewComponent.componentPath = localData.componentPath;
        editViewComponent.config = me.editViewDataTransComp(localData,'domain');
        return editViewComponent;
    },
    //editViewDataConfigs 转成dto组件数组
    editViewDataConfigsTransComps: function (editViewDataConfigs) {
        var me = this;
        var comps = [];
        Ext.Array.each(editViewDataConfigs, function (editViewDataConfig) {
            comps.push(me.editViewDataTransComp(editViewDataConfig, 'dto'));
        })
        return comps;
    }
})
