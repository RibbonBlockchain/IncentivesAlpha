import {Request, Response, NextFunction} from "express";
import { WalletController } from "../controllers/walletController";

export class Routes { 
    
    public walletController: WalletController = new WalletController() 
    
    public routes(app): void {   
        
        app.route('/')
        .get((req: Request, res: Response) => {            
            res.status(200).send({
                message: 'GET request successfulll!!!!??<..>'
            })
        })
        
        // Wallet 
        app.route('/wallet')
        .get((req: Request, res: Response, next: NextFunction) => {
            // middleware
            console.log(`Request from: ${req.originalUrl}`);
            console.log(`Request type: ${req.method}`);            
            if(req.query.key !== '78942ef2c1c98bf10fca09c808d718fa3734703e'){
                res.status(401).send('You shall not pass!');
            } else {
                next();
            }                        
        }, this.walletController.getWallets)        

        // POST endpoint
        .post(this.walletController.addNewWallet);

        // Wallet detail
        app.route('/wallet/:walletId')
        // get specific wallet
        .get(this.walletController.getWalletWithID)
        .put(this.walletController.updateWallet)
        .delete(this.walletController.deleteWallet)

    }
}