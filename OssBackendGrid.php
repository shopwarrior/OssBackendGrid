<?php
namespace OssBackendGrid;

use Shopware\Components\Plugin;
use Symfony\Component\DependencyInjection\ContainerBuilder;

/**
 * Shopware-Plugin OssBackendGrid.
 */
class OssBackendGrid extends Plugin
{
    public static function getSubscribedEvents()
    {
        return array(
            'Enlight_Controller_Dispatcher_ControllerPath_Backend_OssBackendGrid' => 'onGetOssBackendGrid',
        );
    }

    /**
     * @param ContainerBuilder $container
     */
    public function build(ContainerBuilder $container)
    {
        $container->setParameter('oss_backend_grid.plugin_dir', $this->getPath());
        parent::build($container);
    }

    /**
     * Register the backend controller
     *
     * @param   \Enlight_Event_EventArgs $args
     * @return  string
     * @Enlight\Event Enlight_Controller_Dispatcher_ControllerPath_Backend_OssBackendGrid     */
    public function onGetOssBackendGrid(\Enlight_Event_EventArgs $args)
    {
        $this->container->get('template')->addTemplateDir($this->getPath() . '/Resources/views/');
        return __DIR__ . '/Controllers/Backend/OssBackendGrid.php';
    }
}
