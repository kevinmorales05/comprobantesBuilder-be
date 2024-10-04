import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { Comprobantes } from 'src/types/types';
import axios from 'axios';
import { chromium } from 'playwright';

@Injectable()
export class BuildcomprobanteService {
  async generatePdf(data: Comprobantes): Promise<any> {
    // Read the template file
    const templateHtml = fs.readFileSync(
      path.join(process.cwd(), 'src', 'templates', 'comprobante.hbs'),
      'utf8',
    );

    // Compile the template
    const template = Handlebars.compile(templateHtml);

    // Render the template with data
    const html = template(data.comprobantes[0]);
    //process.env.PLAYWRIGHT_BROWSERS_PATH
    // Launch a headless browser
    const browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
      executablePath: process.env.PLAYWRIGHT_BROWSERS_PATH,
    });
    const page = await browser.newPage();

    // Set the HTML content
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    // Generate PDF buffer
    const pdfBuffer = await page.pdf({
      format: 'A4',
    });

    await browser.close();
    console.log('testing write sysmtem the pdf');
    console.log('in this outsource ', process.cwd());
    const outputPath = path.join(process.cwd(), 'src', 'pdfs', 'output.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log('pdf buffer ', pdfBuffer);
    console.log(typeof pdfBuffer);
    const pdfBufferConverted = Buffer.from(pdfBuffer);
    const pdfBase64 = pdfBufferConverted.toString('base64');

    const dataInfo = JSON.stringify({
      sender: {
        name: 'Generador de Comprobantes SPEI',
        email: 'kevin@quantumpay.mx',
      },
      to: [
        {
          email: data.emailToSend,
          name: 'Comprobante Generado',
        },
      ],
      subject: 'Comprobante Generado',
      htmlContent: html,
      attachment: [
        {
          name: 'comprobante.pdf',
          content: pdfBase64,
        },
      ],
    });
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.URL_BREVO,
      headers: {
        Accept: 'application/json',
        'api-key': process.env.APIKEY_BREVO,
        'Content-Type': 'application/json',
      },
      data: dataInfo,
    };
    axios
      .request(config)
      .then((response) => {
        //console.log(JSON.stringify(response.data));
        console.log('response status ', response.status);
        //console.log('response ', response);
        if (response.status === 201) {
          console.log('yes it is 201');
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return pdfBase64;
  }
  async sendComprobante(data: Comprobantes): Promise<any> {
    // Read the template file
    if (data.comprobantes[0].company) {
      if (data.comprobantes[0].company === 'Tesored') {
        console.log('Tesored template!');
        const templateHtml = fs.readFileSync(
          path.join(process.cwd(), 'src', 'templates', 'comprobante.hbs'),
          'utf8',
        );
        // Compile the template
        const template = Handlebars.compile(templateHtml);

        if (data.comprobantes.length > 0) {
          for (let i = 0; i < data.comprobantes.length; i++) {
            console.log('Item ', i);
            const html = template(data.comprobantes[i]);
            //console.log('testing correct file reading', html);
            // Launch a headless browser
            console.log(
              'Playwright Browsers Path:',
              process.env.PLAYWRIGHT_BROWSERS_PATH,
            );
            //desde aqui
            const browser = await chromium.launch({
              headless: true,
              executablePath: process.env.PLAYWRIGHT_BROWSERS_PATH,
              args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
              ],
            });
            const page = await browser.newPage();

            // Set the HTML content
            await page.setContent(html, { waitUntil: 'domcontentloaded' });
            await page.waitForLoadState('networkidle'); // Espera a que se complete la carga de la red

            // Generate PDF buffer
            const pdfBuffer = await page.pdf({
              format: 'A4',
            });

            await browser.close();
            //hasta aqui
            const outputPath = path.join(
              process.cwd(),
              'src',
              'pdfs',
              'output.pdf',
            );
            fs.writeFileSync(outputPath, pdfBuffer);
            const pdfBufferConverted = Buffer.from(pdfBuffer);
            const pdfBase64 = pdfBufferConverted.toString('base64');

            const dataInfo = JSON.stringify({
              sender: {
                name: 'Generador de Comprobantes SPEI',
                email: 'kevin@quantumpay.mx',
              },
              to: [
                {
                  email: data.emailToSend,
                  name: 'Comprobante Generado',
                },
              ],
              subject: 'Comprobante Generado',
              htmlContent: html,
              attachment: [
                {
                  name: 'comprobante.pdf',
                  content: pdfBase64,
                },
              ],
            });
            const config = {
              method: 'post',
              maxBodyLength: Infinity,
              url: process.env.URL_BREVO,
              headers: {
                Accept: 'application/json',
                'api-key': process.env.APIKEY_BREVO,
                'Content-Type': 'application/json',
              },
              data: dataInfo,
            };
            axios
              .request(config)
              .then((response) => {
                //console.log(JSON.stringify(response.data));
                console.log('response status ', response.status);
                //console.log('response ', response);
                if (response.status === 201) {
                  console.log('yes it is 201');
                }
              })
              .catch((error) => {
                console.log(error);
                return {
                  message:
                    'Error al momento de enviar correos electrónicos a los destinatarios!',
                  code: '02',
                };
              });
          }
        }
        return {
          message:
            'El reporte fue realizado con éxito y se entregó un correo de confirmación al equipo de Cumplimiento!',
          code: '01',
        };
      } else {
        console.log('Traxwire and Inbursa template!');
        const templateHtml = fs.readFileSync(
          path.join(
            process.cwd(),
            'src',
            'templates',
            'comprobanteTraxwire.hbs',
          ),
          'utf8',
        );
        // Compile the template
        const template = Handlebars.compile(templateHtml);

        if (data.comprobantes.length > 0) {
          for (let i = 0; i < data.comprobantes.length; i++) {
            console.log('Item ', i);
            if (data.comprobantes[i].abono === '-') {
              data.comprobantes[i].abono = '';
            } else {
              data.comprobantes[i].cargo = '';
            }
            const html = template(data.comprobantes[i]);
            //console.log('testing correct file reading', html);
            // Launch a headless browser
            const browser = await chromium.launch({
              headless: true,
              executablePath: process.env.PLAYWRIGHT_BROWSERS_PATH,
              args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
              ],
            });
            const page = await browser.newPage();

            // Set the HTML content
            await page.setContent(html, { waitUntil: 'domcontentloaded' });
            await page.waitForLoadState('networkidle');
            // Generate PDF buffer
            const pdfBuffer = await page.pdf({
              format: 'A4',
            });

            await browser.close();
            const outputPath = path.join(
              process.cwd(),
              'src',
              'pdfs',
              'output.pdf',
            );
            fs.writeFileSync(outputPath, pdfBuffer);
            const pdfBufferConverted = Buffer.from(pdfBuffer);
            const pdfBase64 = pdfBufferConverted.toString('base64');

            const dataInfo = JSON.stringify({
              sender: {
                name: 'Generador de Comprobantes SPEI',
                email: 'kevin@quantumpay.mx',
              },
              to: [
                {
                  email: data.emailToSend,
                  name: 'Comprobante Generado',
                },
              ],
              subject: 'Comprobante Generado',
              htmlContent: html,
              attachment: [
                {
                  name: 'comprobante.pdf',
                  content: pdfBase64,
                },
              ],
            });
            const config = {
              method: 'post',
              maxBodyLength: Infinity,
              url: process.env.URL_BREVO,
              headers: {
                Accept: 'application/json',
                'api-key': process.env.APIKEY_BREVO,
                'Content-Type': 'application/json',
              },
              data: dataInfo,
            };
            axios
              .request(config)
              .then((response) => {
                //console.log(JSON.stringify(response.data));
                console.log('response status ', response.status);
                //console.log('response ', response);
                if (response.status === 201) {
                  console.log('yes it is 201');
                }
              })
              .catch((error) => {
                console.log(error);
                return {
                  message:
                    'Error al momento de enviar correos electrónicos a los destinatarios!',
                  code: '02',
                };
              });
          }
        }
        return {
          message:
            'El reporte fue realizado con éxito y se entregó un correo de confirmación al equipo de Cumplimiento!',
          code: '01',
        };
      }
    }
  }
  async sendInBunch(data: Comprobantes): Promise<any> {
    // Read the template file
    const templateHtml = fs.readFileSync(
      path.join(process.cwd(), 'src', 'templates', 'comprobante.hbs'),
      'utf8',
    );

    // Compile the template
    const template = Handlebars.compile(templateHtml);

    // Render the template with data
    const html = template(data.comprobantes[0]);

    // Launch a headless browser
    const browser = await chromium.launch({
      headless: true, // Ensure headless mode is enabled
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ], // Disable sandboxing
      executablePath: process.env.PLAYWRIGHT_BROWSERS_PATH,
    });
    const page = await browser.newPage();

    // Set the HTML content
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    // Generate PDF buffer
    const pdfBuffer = await page.pdf({
      format: 'A4',
    });

    await browser.close();
    console.log('testing write sysmtem the pdf');
    console.log('in this outsource ', process.cwd());
    const outputPath = path.join(process.cwd(), 'src', 'pdfs', 'output.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log('pdf buffer ', pdfBuffer);
    console.log(typeof pdfBuffer);
    const pdfBufferConverted = Buffer.from(pdfBuffer);
    const pdfBase64 = pdfBufferConverted.toString('base64');

    const dataInfo = JSON.stringify({
      sender: {
        name: 'Generador de Comprobantes SPEI',
        email: 'kevin@quantumpay.mx',
      },
      to: [
        {
          email: data.emailToSend,
          name: 'Comprobante Generado',
        },
      ],
      subject: 'Comprobante Generado',
      htmlContent: html,
      attachment: [
        {
          name: 'comprobante.pdf',
          content: pdfBase64,
        },
      ],
    });
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.URL_BREVO,
      headers: {
        Accept: 'application/json',
        'api-key': process.env.APIKEY_BREVO,
        'Content-Type': 'application/json',
      },
      data: dataInfo,
    };
    axios
      .request(config)
      .then((response) => {
        //console.log(JSON.stringify(response.data));
        console.log('response status ', response.status);
        //console.log('response ', response);
        if (response.status === 201) {
          console.log('yes it is 201');
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return pdfBase64;
  }
}
