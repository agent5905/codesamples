//
//  PDFViewer.swift
//  ip3
//
//  Created by Daniel Garcia on 12/6/17.
//

import UIKit


class PDFViewer: UIWebView {
    var contentHeight:Double = 0.0
    var contentNum = 0
    var contentRatio:CGFloat = 1.0
    var pages:[CGRect] = []
    var pdfData:Data?
    
    func loadPDF(data:String){
        if let decodeData = Data(base64Encoded: data, options:[]) {
            pdfData = decodeData
            self.load(decodeData, mimeType: "application/pdf", textEncodingName: "utf-8", baseURL: URL(string: "")!)
        }
    }
    
    func webViewDidFinishLoad(_ webView: UIWebView) {
        //This is to setup the page scrolling when using a webview to handle pdf's
        
        let views = webView.scrollView.subviews
        
        for view in views {
            if view.isKind(of: NSClassFromString("UIWebPDFView")!) {
                self.contentHeight = roundValue(Double(view.bounds.size.height),places: 2)
            }
        }
        
        let pdfDataRef:CFData = CFDataCreate(kCFAllocatorDefault, (pdfData! as NSData).bytes.bindMemory(to: UInt8.self, capacity: pdfData!.count), pdfData!.count)
        let provdier:CGDataProvider = CGDataProvider(data: pdfDataRef)!
        if let pdf:CGPDFDocument = CGPDFDocument(provdier) {
            
            self.contentNum = pdf.numberOfPages
            self.pages = []
            var total:CGFloat = 0.0
            for pageIndex in 1 ... self.contentNum {
                let page:CGPDFPage = pdf.page(at: pageIndex)!
                let frame = page.getBoxRect(CGPDFBox.mediaBox)
                self.pages.append(frame)
                total += frame.height
            }
            
            self.contentRatio = webView.scrollView.contentSize.height / total
        }
    }
    
    func webView(_ webView: UIWebView, shouldStartLoadWith request: URLRequest, navigationType: UIWebViewNavigationType) -> Bool {
        if navigationType == UIWebViewNavigationType.linkClicked {
            if request.url!.description.index(of: "page") != nil {
                let string = request.url!.description
                let pageLocation = string.index(of: "page")!
                let start = string.index(string.startIndex, offsetBy: pageLocation + 4)
                let end = string.endIndex
                let range = start..<end
                let pageNum = string.substring(with: range)
                let pageNumInt = pageNum.toIntValue()
                gotoPage(pageNumInt)
            }
            
            return false
        }
        
        return true
    }
    
    func gotoPage(_ pageNumber:Int){
        //WebView does not handle the internal links so this allows the ability to scroll to a certain
        //page. It works by storing all the page sizes indivdually and then adds them up to get the
        //total then it subtracts the first page to set the 0 position. Then it scales it to the ratio
        //of the pdf size by the webview.
        
        var posY:CGFloat = 0.0
        
        for pageIndex in 0 ..< pageNumber {
            posY += pages[pageIndex].height
        }
        posY = posY - pages[0].height
        
        posY = posY * self.contentRatio
        
        self.scrollView.setContentOffset(CGPoint(x: 0, y: posY), animated: true)
    }
}
