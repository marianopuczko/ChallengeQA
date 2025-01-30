import { Builder, By, Key, until } from 'selenium-webdriver';

describe("TC-002", () => {
  it("Buscar varios productos, elegir el segundo resultado de cada uno, verificar stock y agregar al carrito", async () => {
    let driver = new Builder().forBrowser("chrome").build();
    try {
      await driver.manage().window().maximize();
      await driver.get("https://www.fravega.com/");
      
      try {
        let geoModalCloseButton = await driver.wait(
          until.elementLocated(By.css("[data-test-id='geo-modal-close']")),
          3000
        );
        await geoModalCloseButton.click();
        console.log("Modal de geolocalización cerrado.");
      } catch (error) {
        console.log("No se encontró el modal de geolocalización, continuando...");
      }

      try {
        let popupCloseButton = await driver.wait(
          until.elementLocated(By.css("[data-test-id='close-modal-button']")),
          3000
        );
        await popupCloseButton.click();
        console.log("Popup cerrado.");
      } catch (error) {
        console.log("No se encontró popup, continuando con la ejecución...");
      }

      const productos = ["Heladera Samsung", "Aire Acondicionado LG"];
      
      for (const producto of productos) {
        console.log(`Buscando: ${producto}`);

        let searchBox = await driver.wait(
          until.elementLocated(By.name("keyword")),
          8000
        );

        try {
            let popupCloseButton = await driver.wait(
              until.elementLocated(By.css("[data-test-id='close-modal-button']")),
              3000
            );
            await popupCloseButton.click();
            console.log("Popup cerrado.");
          } catch (error) {
            console.log("No se encontró popup, continuando con la ejecución...");
          }
          
        await searchBox.clear();
        await searchBox.sendKeys(producto, Key.RETURN);

        await driver.wait(
          until.elementsLocated(By.css("[data-test-id='results-list']")),
          5000
        );

        let results = await driver.findElements(
          By.css("[data-test-id='results-list'] a")
        );
        if (results.length >= 2) {
          await driver.wait(until.elementIsVisible(results[1]), 5000);
          
          await driver.executeScript("arguments[0].scrollIntoView(true);", results[1]);

          try {
            await driver.wait(until.stalenessOf(geoModalCloseButton), 8000);
            console.log("El modal de geolocalización ya no está presente.");
          } catch (error) {
            console.log("El modal de geolocalización ya no está presente.");
          }

          await driver.executeScript("arguments[0].click();", results[1]);
        } else {
          console.log(`No se encontraron suficientes resultados para ${producto}`);
          continue; 
        }

        await driver.sleep(8000);

        let buyButton = await driver.findElement(
          By.css("[data-test-id='product-buy-button']")
        );
        let isEnabled = await buyButton.isEnabled();
        if (!isEnabled) {
          console.log(`El producto ${producto} no tiene stock`);
          continue; 
        }

        let addToCartButton = await driver.findElement(
          By.xpath(
            "/html/body/div[1]/div[2]/div[2]/div[3]/div[2]/div/div[2]/div[9]/div/button"
          )
        );

        await driver.wait(until.elementIsVisible(addToCartButton), 8000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", addToCartButton);
        await addToCartButton.click();

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
          console.log(`El producto ${producto} no se agregó al carrito`);
        } else {
          console.log(`Se agregó el producto ${producto} al carrito`);
        }

        await driver.get("https://www.fravega.com/");
      }
    } finally {
      await driver.quit();
    }
  });
});
