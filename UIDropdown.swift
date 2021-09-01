//
//  UIDropdown.swift
//  ip3
//
//  Created by Daniel Garcia on 5/24/19.
//

import Foundation
import UIKit
 
@objc protocol UIDropdownDelegate:class{
    func dropdownDidChange(selectedIndex:Int, selectedText:String)
}

@IBDesignable class UIDropdown: UILabel, DropdownListDelegate, UIPopoverPresentationControllerDelegate {
    
    private var subLabel = UILabel()
    
    @IBInspectable var borderColor:UIColor = UIColor(red: 0.0, green: 0.0, blue: 0.0, alpha: 1.0)
    @IBInspectable var borderWidth:CGFloat = 0.5
    
    
    weak var delegate: UIDropdownDelegate?
    weak var viewController:UIViewController?
    var dropdownList:DropdownList = DropdownList(style: .plain)
    var cornerRadius:CGFloat = 5.0
    var selectedText:String = ""
    
    var items:[String] = [] {
        didSet {
            resetItems()
        }
    }
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setup()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        setup()
    }
    
    override func prepareForInterfaceBuilder() {
        self.draw()
    }
    override internal func awakeFromNib() {
        super.awakeFromNib()
        self.draw()
    }
    
    override func didMoveToSuperview() {
        self.setupGestures()
    }
    
    func setup(){
        dropdownList.delegate = self
        dropdownList.maxWidth = 10
    }
    
    func setupGestures() {
        self.isUserInteractionEnabled = true
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(labelTap))
        tapGesture.numberOfTapsRequired = 1
        self.addGestureRecognizer(tapGesture)
    }
    
    func resetItems() {
        dropdownList.items = self.items
    }
    
    func labelTap(sender: UITapGestureRecognizer) {
        dropdownList.modalPresentationStyle = UIModalPresentationStyle.popover
        dropdownList.popoverPresentationController?.permittedArrowDirections = .up
        dropdownList.popoverPresentationController?.delegate = self
        dropdownList.popoverPresentationController?.sourceView = sender.view
        dropdownList.popoverPresentationController?.sourceRect = sender.view!.bounds
        
        viewController?.present(dropdownList, animated: true, completion: nil)
    }
    
    
    internal func itemSelected(selectedItemIndex: Int, selectedItemText: String) {
        DispatchQueue.main.async {
            self.text = selectedItemText
            self.delegate?.dropdownDidChange(selectedIndex: selectedItemIndex, selectedText: selectedItemText)
        }
    }
    
    func adaptivePresentationStyle(for controller: UIPresentationController) -> UIModalPresentationStyle {
        return UIModalPresentationStyle.none
    }
    
    func draw() {
        DispatchQueue.main.async {
            self.layer.borderColor = self.borderColor.cgColor
            self.layer.borderWidth = self.borderWidth
            self.layer.cornerRadius = self.cornerRadius
            self.layer.masksToBounds = true
        }
    }
    
    
}


protocol DropdownListDelegate:class {
    func itemSelected(selectedItemIndex:Int, selectedItemText:String)
}

class DropdownList: UITableViewController {
    weak var delegate:DropdownListDelegate?
    var popoverHeight:CGFloat = 45.0
    var popoverWidth:CGFloat = 300.0
    
    var items: [String] = [] {
        didSet {
            self.setHeight()
        }
    }

    var maxRows:Int = 50 {
        didSet {
            self.setHeight()
        }
    }
    
    var maxWidth:Int = 20 {
        didSet {
            self.setWidth()
        }
    }
    
    required init? (coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    
    override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
        super.init(nibName: nibNameOrNil, bundle: nibBundleOrNil)
        
        tableView.register(UITableViewCell.classForCoder(), forCellReuseIdentifier: "dropdownCell")
    }
    
    override init(style: UITableViewStyle) {
        super.init(style: style)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        DispatchQueue.main.async {
            self.popoverPresentationController?.presentedView?.layer.borderColor = UIColor.black.cgColor
            self.popoverPresentationController?.presentedView?.layer.borderWidth = 1.0
            self.view.backgroundColor = UIColor.white
        }
        tableView.register(UITableViewCell.classForCoder(), forCellReuseIdentifier: "dropdownCell")
        self.tableView.delegate = self
        self.tableView.dataSource = self
        
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        setHeight()
        setWidth()
        
        self.preferredContentSize = CGSize(width: self.popoverWidth, height: self.popoverHeight)
        
        DispatchQueue.main.async {
            self.tableView.reloadData()
            self.popoverPresentationController?.backgroundColor = UIColor.white
        }
        
        
    }
    
    
    func setHeight() {
        var count:Int
        if items.count > maxRows {
            count = maxRows
        }else{
            count = items.count
        }
        
        popoverHeight = CGFloat(count) * 45.0
    }
    
    func setWidth() {
        var maxLength:Int = 20
        
        if maxWidth == -1 {
            for item in items {
                let length = item.length
                
                if maxLength < length {
                    maxLength = length
                }
                
            }
        }else{
            maxLength = maxWidth
        }
        
        popoverWidth = (CGFloat(maxLength) * 10.0) + 5.0
    }
    
    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return items.count
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "dropdownCell")
        
        cell!.textLabel?.text = items[indexPath.row]
        
        return cell!
        
        
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let selectedItem = items[indexPath.row]
        
        delegate?.itemSelected(selectedItemIndex: indexPath.row, selectedItemText: selectedItem)
        
        performCancel()
    }
    
    func performCancel() {
        self.dismiss(animated: true, completion: nil)
    }
}
