import { Builder, By, Key, until } from 'selenium-webdriver';

describe("TC-001", () => {
  it("Buscar 'Heladera Samsung', elegir el segundo resultado, verificar stock y agregar al carrito", async () => {
    let driver = new Builder().forBrowser("chrome").build();
    try {
      await driver.manage().window().maximize();
      await driver.get("https://www.fravega.com/");

      // Cierra el popup si aparece
      try {
        let popupCloseButton = await driver.wait(
          until.elementLocated(By.css("[data-test-id='close-modal-button']")),
          3000
        );
        await popupCloseButton.click();
      } catch (error) {
        console.log("No se encontró popup, continuando con la ejecucion...");
      }

      // Esperar a que el campo de búsqueda esté visible
      let searchBox = await driver.wait(
        until.elementLocated(By.name("keyword")),
        5000
      );
      await searchBox.sendKeys("Heladera Samsung", Key.RETURN);

      // Esperar a que carguen los resultados de la busqueda
      await driver.wait(
        until.elementsLocated(By.css("[data-test-id='results-list']")),
        5000
      );

      // Seleccionar el segundo resultado
      let results = await driver.findElements(
        By.css("[data-test-id='results-list'] a")
      );
      if (results.length >= 2) {
        await driver.wait(until.elementIsVisible(results[1]), 5000);
        await results[2].click();
      } else {
        throw new Error("No se encontraron suficientes resultados");
      }

      // Esperar a que cargue la página del producto
      await driver.sleep(3000);

      // Verificar si el botón de compra está habilitado es porque existe stock
      let buyButton = await driver.findElement(
        By.css("[data-test-id='product-buy-button']")
      );
      let isEnabled = await buyButton.isEnabled();
      if (!isEnabled) {
        throw new Error("El producto no tiene stock");
      }

      await driver.sleep(3000);

      // Agregar al carrito
      let addToCartButton = await driver.findElement(
        By.xpath(
          "/html/body/div[1]/div[2]/div[2]/div[3]/div[2]/div/div[2]/div[9]/div/button"
        )
      );
      await addToCartButton.click();

      // Esperar y verificar que el producto está en el carrito
      await driver.sleep(6000);
      let cartIcon = await driver.findElement(
        By.css("[data-test-id='button-cart']")
      );
      await cartIcon.click();

      await driver.sleep(3000);

      let goCart = await driver.findElement(
        By.css("[data-test-id='link-go-to-cart']")
      );
      await goCart.click();

      let cartItems = await driver.findElements(
        By.xpath("/html/body/div[1]/div/div[1]/main/div[1]/div[1]")
      );
      if (cartItems.length === 0) {
        throw new Error("El producto no se agregó al carrito");
      }
      console.log(`Se agregó ${cartItems.length} producto al carrito`);
    } finally {
      await driver.quit();
    }
  });
});
